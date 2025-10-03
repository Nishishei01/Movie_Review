import express from "express";
import Controller from "./comment.controller"
import validate from "../utils/validate";
import { createCommentSchema } from "./comment.validator";

const router = express.Router();

router.post(
  '/',
  validate.validateInput(createCommentSchema),
  Controller.createComment
)

router.get(
  '/',
  Controller.getAllComment
) 

router.get(
  '/:id',
  Controller.getCommentById
)

router.put(
  '/:id',
  validate.validateInput(createCommentSchema),
  Controller.updateCommentById
)

router.delete(
  '/:id',
  Controller.deleteCommentById
)

export default router