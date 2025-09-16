import { Router } from "express";
import * as ctrl from "../controllers/role.controller";
import { body, param, query } from "express-validator";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roleCheck";

const router = Router();

// Create Role
router.post(
  "/",
  authMiddleware,
  // requireRole(["Admin"]),
  body("roleName").isString().notEmpty(),
  validate,
  ctrl.createRole
);

// List Roles
router.get(
  "/",
  authMiddleware,
  query("search").optional().isString(),
  query("skip").optional().isInt({ min: 0 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  validate,
  ctrl.listRoles
);

// Get Role by ID
router.get(
  "/:id",
  authMiddleware,
  param("id").isMongoId(),
  validate,
  ctrl.getRoleById
);

// Delete Role
router.delete(
  "/:id",
  authMiddleware,
  // requireRole(["Admin"]),
  param("id").isMongoId(),
  validate,
  ctrl.deleteRole
);

// Add Access
router.post(
  "/:id/add-access",
  authMiddleware,
  // requireRole(["Admin"]),
  param("id").isMongoId(),
  body("modules").isArray({ min: 1 }),
  validate,
  ctrl.addAccess
);

// Remove Access
router.post(
  "/:id/remove-access",
  authMiddleware,
  // requireRole(["Admin"]),
  param("id").isMongoId(),
  body("moduleName").isString().notEmpty(),
  validate,
  ctrl.removeAccess
);

// Check Access
router.get(
  "/:id/has-access",
  authMiddleware,
  param("id").isMongoId(),
  query("moduleName").isString().notEmpty(),
  validate,
  ctrl.hasAccess
);

export default router;
