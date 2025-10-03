import * as z from "zod";

export const createMovieSchema = z.object({
  title: z.string(),
  description: z.string(),
  releaseYear: z.iso.datetime(),
  category: z.array(z.string()),
})

export type CreateMovieForm = z.infer<typeof createMovieSchema>;
