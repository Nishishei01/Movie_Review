import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateReviewForm } from "./review.validator";

const prisma = new PrismaClient();

export default {
  createReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, rating, movieId } = req.body as CreateReviewForm
      const userId = res.locals.user.id

      const result = await prisma.$transaction(async (tx) => {
        const createdReview = await tx.review.create({
          data: {
            content,
            rating,
            movieId,
            userId
          }
        })

        return createdReview
      })

      res.status(200).json({
        message: `Create review successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  getAllReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, rating, userId, movieId } = req.query

      const querys :any = {
        ...(content && { content: { contains: String(content), mode: "insensitive" }}),
        ...(rating && { rating: { equals: Number(rating) }}),
        ...(userId && { user: { is: { id: Number(userId) }}}),
        ...(movieId && { movie: { is: { id: Number(movieId) }}})
      }

      const result = await prisma.$transaction(async (tx) => {
        const reviews = await tx.review.findMany({
          where: {
            ...querys
          },
          include: {
            user: true,
            movie: true,
            likes: true
          }
        })
        return reviews
      })

      res.status(200).json({  
        message: "Get all reviews successfully",
        data: result
      })

    } catch (error) {
      next(error)
    }
  },
  getReviewById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      
      const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            user: true,
            movie: true,
            likes: true
          }
        })
        return review
      })

      res.status(200).json({
        message: `Get review by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  updateReviewById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { content, rating, movieId } = req.body as CreateReviewForm
      
      const result = await prisma.$transaction(async (tx) => {
        const updatedReview = await tx.review.update({
          where: {
            id: Number(id)
          },
          data: {
            content,
            rating,
            movieId
          }
        })
        return updatedReview
      })

      res.status(200).json({
        message: `Update review by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  deleteReviewById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await prisma.$transaction(async (tx) => {
        const deletedReview = await tx.review.delete({
          where: {
            id: Number(id)
          }
        })
        return deletedReview
      })

      res.status(200).json({
        message: `Delete review by id successfully`,
        data: result
       })
       
    } catch (error) {
      next(error)
    }
  }
}