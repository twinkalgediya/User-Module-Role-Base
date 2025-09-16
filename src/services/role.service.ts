import mongoose from "mongoose";
import { IRole, Role } from "../models/role.model";

/**
 * Create a new role
 */
export const createRole = (payload: Partial<IRole>) => {
  return Role.create(payload);
};

/**
 * List roles with optional search
 */
export const listRolesAggregate = (search?: string, skip = 0, limit = 20) => {
  const match: any = {};
  if (search) {
    match.roleName = { $regex: search, $options: "i" };
  }

  const pipeline: any[] = [
    { $match: match },
    {
      $project: {
        roleName: 1,
        accessModules: 1,
        active: 1,
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  return Role.aggregate(pipeline);
};

/**
 * Get a role by ID
 */
export const getRoleById = (id: string) => {
  return Role.findById(id);
};

/**
 * Delete a role
 */
export const deleteRole = (id: string) => {
  return Role.findByIdAndDelete(id);
};

/**
 * Add unique modules to a role
 */
export const addUniqueModules = (id: string, modules: string[]) => {
  return Role.findByIdAndUpdate(
    id,
    { $addToSet: { accessModules: { $each: modules } } },
    { new: true }
  );
};

/**
 * Remove a single module from a role
 */
export const removeModule = (id: string, moduleName: string) => {
  return Role.findByIdAndUpdate(
    id,
    { $pull: { accessModules: moduleName } },
    { new: true }
  );
};

/**
 * Check if a role has access to a given module
 */
export const hasAccessAggregate = async (
  roleId: string,
  moduleName: string
) => {
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(roleId),
      },
    },
    {
      $project: {
        hasAccess: { $in: [moduleName, "$accessModules"] },
      },
    },
  ];

  const result = await Role.aggregate(pipeline);
  return result.length > 0 ? result[0].hasAccess : false;
};
