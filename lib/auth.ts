import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { IAdmin } from "./models/Admin";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(admin: IAdmin) {
  return jwt.sign(
    { adminId: admin._id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
export interface DecodedToken {
  adminId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return request.cookies.get("admin-token")?.value;
}
