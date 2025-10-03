import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateMovieForm } from "./movie.validator";

const prisma = new PrismaClient();

export default {
  createMovie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, releaseYear, category } = req.body as CreateMovieForm

      const result = await prisma.$transaction(async (tx) => {
        const createdMovie = await tx.movie.create({
          data: {
            title,
            description,
            releaseYear,
            category
          }
        })

        return createdMovie
      })

      console.log({...res.locals});
      
      res.status(200).json({
        message: `Create movie successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  getAllMovie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, releaseYear, category, reviewId } = req.query

      const querys :any = {
        ...(title && { title: { contains: String(title), mode: "insensitive"}}),
        ...(description && { description: { contains: String(description), mode: "insensitive"}}),
        ...(releaseYear && { releaseYear: new Date(String(releaseYear))}),
        ...(category && { category: { has: String(category) }}),
        ...(reviewId && { reviews: { some: { id: Number(reviewId) }}})
      }
      
      const result = await prisma.$transaction(async (tx) => {
        const movies = await tx.movie.findMany({
          where: {
            ...querys
          },
          include: {
            reviews: {
              include: {
                user: true,
                likes: true
              }
            }
          }
        })
        return movies
      })

      res.status(200).json({
        message: `Get all movies successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  getMovieById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params 

      const result = await prisma.$transaction(async (tx) => {
        const movie = await tx.movie.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            reviews: {
              include: {
                user: true,
                likes: true
              }
            }
          }
        })
        return movie
      })

      res.status(200).json({
        message: `Get movie by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  updateMovieById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, releaseYear, category } = req.body as CreateMovieForm

      const result = await prisma.$transaction(async (tx) => {

        const updatedMovie = await tx.movie.update({
          where: {
            id: Number(id)
          },
          data: {
            title,
            description,
            releaseYear,
            category
          }
        })

        return updatedMovie
      })

      res.status(200).json({
        message: `Update movie by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  deleteMovieById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await prisma.$transaction(async (tx) => {
        const deletedMovie = await tx.movie.delete({
          where: {
            id: Number(id)
          }
        })

        return deletedMovie
      })

      res.status(200).json({
        message: `Delete movie by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  }
}