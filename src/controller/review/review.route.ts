import express from "express";
import Controller from "./review.controller"
import Validate from "../utils/validate";
import { createReviewSchema } from "./review.validator";

const router = express.Router();

router.post(
  '/',
  Validate.validateInput(createReviewSchema),
  Controller.createReview
)

router.get(
  '/',
  Controller.getAllReview
)

router.get(
  '/:id',
  Controller.getReviewById
)

router.put(
  '/:id',
  Validate.validateInput(createReviewSchema),
  Controller.updateReviewById
)

router.delete(
  '/:id',
  Controller.deleteReviewById
)

export default router