import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/auth.service";
export interface AuthRequest extends Request {
  user?: any;
}
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized: no token" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    const user = await findUserById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Unauthorized: user not found" });
    req.user = { id: user._id, role: (user as any).role };
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
