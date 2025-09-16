import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const uid = req.user?.id;
      if (!uid) return res.status(401).json({ message: "Unauthorized" });
      const roleInfo = req.user?.role;
      if (roleInfo && allowedRoles.includes(roleInfo.roleName)) return next();
      const user = await User.findById(uid).populate("role", "roleName");
      const roleName = (user as any)?.role?.roleName;
      if (!roleName)
        return res.status(403).json({ message: "Forbidden: no role assigned" });
      if (!allowedRoles.includes(roleName))
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" });
      return next();
    } catch (err) {
      return res.status(500).json({ message: "Server error in role check" });
    }
  };
};
