import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
/**
 * Signup
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const existing = await authService.findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already taken" });
    const user = await authService.createUser(req.body);
    const obj = user.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    next(err);
  }
};

/**
 * Login
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = require("../services/auth.service").generateToken({
      id: user._id,
    });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: (user as any).role,
      },
    });
  } catch (err) {
    next(err);
  }
};
