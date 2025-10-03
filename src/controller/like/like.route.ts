import express from "express";
import Controller from "./like.controller"
import Validate from "../utils/validate";
import validate from "../utils/validate";
import { likeSchema } from "./like.validator";

const router = express.Router();

router.post(
  '/',
  validate.validateInput(likeSchema),
  Controller.createLike
)

router.delete(
  '/:id',
  Controller.deleteLike
)

export default router