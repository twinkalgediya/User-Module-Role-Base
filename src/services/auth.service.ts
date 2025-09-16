import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET || "secret";
const jwtExpires = process.env.JWT_EXPIRES_IN || "1d";

/*
Generate JWT token
*/
export const generateToken = (payload: object) =>
  jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });

/*
Fin user By Email
*/
export const findUserByEmail = (email: string) =>
  User.findOne({ email }).populate("role", "roleName accessModules");

/*
Find User by id
*/
export const findUserById = (id: string) =>
  User.findById(id).populate("role", "roleName accessModules");
export const createUser = (data: any) => User.create(data);
