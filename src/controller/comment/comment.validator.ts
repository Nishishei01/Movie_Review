import * as z from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCommentSchema = z.object({
  text: z.string(),
  reviewId: z.number(),
}).superRefine(async (data, ctx) => {
  const result = await prisma.$transaction(async (tx) => {
    const existingReviewId = await tx.review.findUnique({
      where: {
        id: data.reviewId
      }
    })
    return existingReviewId 
  })

  if (!result) {
    ctx.addIssue({
      code: "custom",
      message: "Review does not exist",
      path: ["reviewId"]
    })
  }
})

export type CreateCommentForm = z.infer<typeof createCommentSchema>;