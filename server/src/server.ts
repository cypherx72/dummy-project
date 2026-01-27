// npm install @apollo/server @as-integrations/express5 express graphql cors
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import http from "http";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import prisma from "./prisma.js";
import { Server } from "socket.io";
import cookie from "cookie";
import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary
cloudinary.config({
  secure: true,
});

// Required logic for integrating with Express
const app = express();
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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
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
app.use(
  "/",
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

    const token = cookies["authjs.session-token"];
    if (!token) throw new Error("No token");

    /*
    Verify JWT token 
    todo: alright the main issue i'm faicing is that i'm not the one controlling the session-token which i want to use for socket auth. 
    todo: need to find a way to sync next-auth session token secret with this server secret or find a way to read next-auth secret here.

    const payload = jwt.verify(
      token,
      "pqe4Mqgah1FnwXoJAnxUCFMqTE1ybUMn5yJ+1jtyeWo="
    );
    */

    const payload = {
      userId: "1",
      role: "student",
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new Error("User not found");

    socket.user = {
      id: payload.userId,
      role: payload.role,
    };

    const chatMemberships = await prisma.chatMember.findMany({
      where: { userId: user.id },
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
