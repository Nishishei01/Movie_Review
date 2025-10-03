import * as z from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerSchema = z.object({
  userName: z.string(),
  password: z.string(),
  email: z.email()
}).superRefine(async (data, ctx) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      userName: data.userName
    }
  })

  if (existingUser) {
    ctx.addIssue({
      code: "custom",
      message: "Username already exists",
      path: ["userName"]
    })
  }
})

export const loginSchema = z.object({
  userName: z.string(),
  password: z.string(),
  email: z.email()
})

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;