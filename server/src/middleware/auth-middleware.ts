// import jwt from "jsonwebtoken";
// import type { Request, Response, NextFunction } from "express";

// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//     name: string;
//     image?: string;
//   };
//   sessionId?: string;
// }

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "dkafdk";

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   try {
//     const token =
//       req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       res.status(401).json({
//         success: false,
//         error: {
//           code: "UNAUTHORIZED",
//           message: "No authentication token provided.",
//           status: 401,
//         },
//       });
//       return;
//     }

//     const decoded = jwt.verify(token, JWT_SECRET_KEY) as { sessionId: string };
//     req.user = decoded;
//     req.sessionId = decoded.sessionId;

//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       error: {
//         code: "INVALID_TOKEN",
//         message: "Invalid or expired token",
//         status: 401,
//       },
//     });
//   }
// };

// export const optionalAuth = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   try {
//     const token =
//       req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

//     if (token) {
//       const decoded = jwt.verify(token, JWT_SECRET_KEY) as any;
//       req.user = decoded;
//       req.sessionId = decoded.sessionId;
//     }

//     next();
//   } catch {
//     // Token invalid but optional, so continue
//     next();
//   }
// };
