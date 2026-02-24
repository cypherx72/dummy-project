import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/passport-config.js";

export function decodeToken(token: string) {
  try {
    const decodedData = jwt.verify(token, JWT_SECRET_KEY);
    return decodedData;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to validate token");
  }
}
