import express from "express";
import Controller from "../auth/auth.controller"
import Validate from "../utils/validate"
import { registerSchema, loginSchema } from "../auth/auth.validator";

const router = express.Router();

router.post(
  '/register',
  Validate.validateInput(registerSchema),
  Controller.register
)

router.post(
  '/login',
  Validate.validateInput(loginSchema),
  Controller.login
)

export default router