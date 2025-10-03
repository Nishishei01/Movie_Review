import express from "express";
import Controller from "./movie.controller"
import validate from "../utils/validate";
import { createMovieSchema } from "./movie.validator";

const router = express.Router();

router.post(
  '/',
  validate.validateInput(createMovieSchema),
  Controller.createMovie
)

router.get(
  '/',
  Controller.getAllMovie
)

router.get(
  '/:id',
  Controller.getMovieById
)

router.put(
  '/:id',
  validate.validateInput(createMovieSchema),
  Controller.updateMovieById
)

router.delete(
  '/:id',
  Controller.deleteMovieById
)

export default router