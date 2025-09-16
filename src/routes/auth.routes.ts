import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import { body } from "express-validator";
import { validate } from "../middlewares/validate";

const router = Router();
router.post(
  "/signup",
  body("email").isEmail().withMessage("valid email required"),
  body("password").isLength({ min: 6 }).withMessage("password min 6"),
  body("firstName").notEmpty().withMessage("firstName required"),
  validate,
  signup
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
  login
);
export default router;
