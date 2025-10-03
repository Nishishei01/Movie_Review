import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateCommentForm } from "./comment.validator";

const prisma = new PrismaClient();

export default {
  createComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, reviewId } = req.body as CreateCommentForm
      const userId = res.locals.user.id

      const result = await prisma.$transaction(async (tx) => {
        const createdComment = await tx.comment.create({
          data: {
            text,
            reviewId,
            userId
          }
        })

        return createdComment
      })

      res.status(200).json({
        message: `Create comment successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  getAllComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, userId, reviewId } = req.query

      const querys: any = {
        ...(text && { text: { constains: String(text), mode: "insensitive" }}),
        ...(userId && { userId: { id: Number(userId)}}),
        ...(reviewId && { reviewId: { id: Number(reviewId)}})
      }

      const result = await prisma.$transaction(async (tx) => {
        const comments = await tx.comment.findMany({
          where: {
            ...querys
          },
          include: {
            user: true,
            review: true
          }
        })
        return comments
      })

      res.status(200).json({
        message: `Get all comment successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  getCommentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      
      const result = await prisma.$transaction(async (tx) => {
        const comment = await tx.comment.findUnique({
          where: {
            id: Number(id)
          },
          include: {
            user: true,
            review: true
          }
        })
        return comment
      })

      res.status(200).json({
        message: `Get comment by id successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  updateCommentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { text } = req.body
      
      const result = await prisma.$transaction(async (tx) => {
        const updatedComment = await tx.comment.update({
          where: {
            id: Number(id)
          },
          data: {
            text
          }
        })
        return updatedComment
      })

      res.status(200).json({
        message: `Update comment successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  deleteCommentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      
      const result = await prisma.$transaction(async (tx) => {
        const deletedComment = await tx.comment.delete({
          where: {
            id: Number(id)
          }
        })
        return deletedComment
      })
      
      res.status(200).json({
        message: `Delete comment successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  }
}