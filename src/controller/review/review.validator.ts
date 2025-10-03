import * as z from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReviewSchema = z.object({
  content: z.string(),
  rating: z.number().min(1).max(5),
  movieId: z.number(),  
}).superRefine(async (data, ctx) => {

  const result = await prisma.$transaction(async (tx) => {
    
    const [existingMovie, existingUser] = await Promise.all([
      await tx.movie.findUnique({
        where: {
          id: data.movieId
        }
      }),
      await tx.user.findUnique({
        where: {
          id: data.movieId
        }
      })
    ])

    return { existingMovie, existingUser }
  })

  if (!result.existingMovie) {
    ctx.addIssue({
      code: "custom",
      message: "Movie does not exist"
    })
  }

  // if (!result.existingUser) {
  //   ctx.addIssue({
  //     code: "custom",
  //     message: "User does not exist"
  //   })
  // }

})

export type CreateReviewForm = z.infer<typeof createReviewSchema>;