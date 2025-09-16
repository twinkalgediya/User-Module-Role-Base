import { Router } from "express";
import {
  listUsers,
  updateManySame,
  updateManyDifferent,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";
import { query, body, param } from "express-validator";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/roleCheck";
const router = Router();

router.get(
  "/",
  authMiddleware,
  query("search").optional().isString(),
  query("skip").optional().isInt(),
  query("limit").optional().isInt(),
  validate,
  listUsers
);

router.get(
  "/:id",
  authMiddleware,
  param("id").isMongoId(),
  validate,
  getUserById
);

router.put(
  "/:id",
  authMiddleware,
  param("id").isMongoId(),
  validate,
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  param("id").isMongoId(),
  validate,
  deleteUser
);

router.patch(
  "/bulk-update",
  authMiddleware,
  //requireRole(["Admin"]),
  body("filter").isObject(),
  body("update").isObject(),
  validate,
  updateManySame
);

router.post(
  "/bulk-diff",
  authMiddleware,
  //requireRole(["Admin"]),
  body("operations").isArray(),
  validate,
  updateManyDifferent
);
export default router;
