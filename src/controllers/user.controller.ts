import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

/**
 * Search support with partial name
 * @param req
 * @param res
 * @param next
 */
export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, skip = 0, limit = 20 } = req.query as any;
    const match: any = {};
    if (search) {
      const s = new RegExp(search, "i");
      match.$or = [
        { firstName: s },
        { lastName: s },
        { email: s },
        { username: s },
      ];
    }
    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
      { $unwind: { path: "$roleInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          username: 1,
          createdAt: 1,
          updatedAt: 1,
          role: {
            roleName: "$roleInfo.roleName",
            accessModules: "$roleInfo.accessModules",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];
    const users = await User.aggregate(pipeline);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * View user details by ID (with role info)
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
 
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const pipeline: any[] = [
      { $match: { _id: new (require("mongoose").Types.ObjectId)(id) } },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
      { $unwind: { path: "$roleInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          username: 1,
          createdAt: 1,
          updatedAt: 1,
          role: {
            roleName: "$roleInfo.roleName",
            accessModules: "$roleInfo.accessModules",
          },
        },
      },
    ];

    const user = await User.aggregate(pipeline);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a single user by ID
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const r = await User.findByIdAndUpdate(id, update, { new: true });
    if (!r) return res.status(404).json({ message: "User not found" });
    res.json(r);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user by ID
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const r = await User.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a functionality to update many users with same data.
 * @param req
 * @param res
 * @param next
 */
export const updateManySame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filter, update } = req.body;
    const r = await User.updateMany(filter || {}, update || {});
    res.json(r);
  } catch (err) {
    next(err);
  }
};

/**
 * Add a functionality to update many users with different data.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateManyDifferent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { operations } = req.body;
    if (!Array.isArray(operations))
      return res.status(400).json({ message: "operations must be array" });
    const ops = operations.map((o: any) => ({
      updateOne: { filter: o.filter, update: o.update },
    }));
    const r = await User.bulkWrite(ops);
    res.json(r);
  } catch (err) {
    next(err);
  }
};
