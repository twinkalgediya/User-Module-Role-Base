import { Request, Response, NextFunction } from "express";
import * as roleService from "../services/role.service";

/**
 * Create Role
 * @param req 
 * @param res 
 * @param next 
 */
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = await roleService.createRole(req.body);
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
};

/**
 * List Role
 * @param req 
 * @param res 
 * @param next 
 */
export const listRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, skip = 0, limit = 20 } = req.query as any;
    const roles = await roleService.listRolesAggregate(
      search,
      Number(skip),
      Number(limit)
    );
    res.json(roles);
  } catch (err) {
    next(err);
  }
};
/**
 * Get Role Details by id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
};
/**
 * Delete role
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await roleService.deleteRole(id);
    if (!deleted) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    next(err);
  }
};
/**
 * Insert only unique value to access modules
 * @param req 
 * @param res 
 * @param next 
 */
export const addAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;
    const updated = await roleService.addUniqueModules(id, modules);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Remove one value from access modules
 * @param req 
 * @param res 
 * @param next 
 */
export const removeAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { moduleName } = req.body;
    const updated = await roleService.removeModule(id, moduleName);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
/**
 * Add a functionality to check whether or not particular user has access to particular
module
 * @param req 
 * @param res 
 * @param next 
 */
export const hasAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { moduleName } = req.query as any;
    const allowed = await roleService.hasAccessAggregate(id, moduleName);
    res.json({ allowed });
  } catch (err) {
    next(err);
  }
};
