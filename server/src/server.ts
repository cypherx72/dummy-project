// npm install @apollo/server @as-integrations/express5 express graphql cors
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import http from "http";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { prisma } from "./lib/prisma.js";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import cookie from "cookie";
import { v2 as cloudinary } from "cloudinary";
import authRouter from "./routes/routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { authMiddleware } from "./middleware/auth-middleware.js";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET!;
// Configure cloudinary
cloudinary.config({
  secure: true,
});

// Required logic for integrating with Express
const app = express();
app.use(cookieParser());
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.

const httpServer = http.createServer(app);
// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start

await server.start();

// Set up Socket.io server
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  },
  connectionStateRecovery: {},
});

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", true);
app.use(cors(corsOptions));
app.use(express.json());

// initialize passport
app.use(passport.initialize());
app.use("/auth", authRouter);

app.use(
  "/graphql",
  authMiddleware,
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => ({
      req,
      res,
      prisma,
      cloudinary,
      io,
    }),
  }),
);

// Listen for Socket.io events
io.on("connection", async (socket) => {
  try {
    console.log("New client connected:", socket.id);
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) throw new Error("No cookies");
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.access_token;

    if (!accessToken) throw new Error("No token");

    // validate access token

    let sessionUser = null;

    try {
      sessionUser = jwt.verify(accessToken, JWT_SECRET) as {
        userId: string;
        email: string;
        image: string;
        role: string;
      };
    } catch {
      console.log(error);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.userId },
      include: { sender: true },
    });

    if (!user) throw new Error("User not found");

    socket.join(`user:${user.id}`);

    const chatMemberships = await prisma.chatMember.findMany({
      where: { senderId: user.sender?.id as string },
      select: { chatId: true },
    });

    chatMemberships.forEach(({ chatId }) => {
      socket.join(`chat:${chatId}`);
    });

    console.log(
      `User ${user.id} joined chats:`,
      chatMemberships.map((c) => c.chatId),
    );

    socket.on("typing", ({ chatId, username, avatar }) => {
      console.log(chatId, username, avatar);
      socket.to(`chat:${chatId}`).emit("typing", { username, avatar, chatId }); //change this later to only emit to others and not the person causing the event
    });

    socket.on("stopTyping", ({ chatId, username, avatar }) => {
      socket
        .to(`chat:${chatId}`)
        .emit("stopTyping", { username, avatar, chatId });
    });

    socket.on("message:new", async ({ message }) => {
      socket.emit("message:delivered", {
        messageId: message.id,
        chatId: message.chatId,
      });
    });
  } catch (err) {
    console.error("Socket connection error:", err);
    socket.disconnect();
  }
});

// Modified server startup

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4000/`);
