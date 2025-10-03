import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  createLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = req.body
      const userId = res.locals.user.id

      const result = await prisma.$transaction(async (tx) => {

        const existingLike = await tx.like.findFirst({
          where: {
            reviewId,
            userId
          }
        })

        if (existingLike) {
          const deletedLike = await tx.like.delete({
            where: {
              id: existingLike.id
            }
          })

          return res.json({
            message: "Unliked successfully",
            data: deletedLike
          })
        } else {
          const createdLike = await tx.like.create({
            data: {
              reviewId,
              userId
            }
          })
          return createdLike
        }
      })

      res.status(200).json({
        message: `Create like successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  deleteLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const result = await prisma.$transaction(async (tx) => {
        const deletedLike = await tx.like.delete({
          where: {
            id: Number(id)
          }
        })
        return deletedLike
      })

      res.status(200).json({
        message: `Delete like successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  }
}