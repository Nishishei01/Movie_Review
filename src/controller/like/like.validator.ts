import * as z from "zod"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const likeSchema = z.object({
  reviewId: z.number(),
  userId: z.number(),
}).superRefine(async (data, ctx) => {
  const result = await prisma.$transaction(async (tx) => {
    const [existingReview, existingUser] = await Promise.all([
      await tx.review.findUnique({
        where: {
          id: data.reviewId
        }
      }),
      await tx.user.findUnique({
        where: {
          id: data.userId
        }
      }),
      await tx.like.findFirst({
        where: {
          reviewId: data.reviewId,
          userId: data.userId
        }
      })
    ])
    return { existingReview, existingUser }
  })

  if (!result.existingReview) {
    ctx.addIssue({
      code: "custom",
      message: "Review does not exist"
    })
  }

  if (!result.existingUser) {
    ctx.addIssue({
      code: "custom",
      message: "User does not exist"
    })
  }

})