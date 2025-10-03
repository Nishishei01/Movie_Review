import e, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import { LoginForm, RegisterForm } from "./auth.validator";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!

export default {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, email, password } = req.body as RegisterForm
      
      const hashPassword = await bcrypt.hash(password, 10)

      const result = await prisma.$transaction(async (tx) => {
        
        const createdUser = await tx.user.create({
          data: {
            userName,
            email,
            password: hashPassword
          }
        })
  
        return createdUser
      })

      res.status(200).json({
        message: `Register user successfully`,
        data: result
       })

    } catch (error) {
      next(error)
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = req.body as LoginForm
      
      const result = await prisma.$transaction(async (tx) => {
        const checkUser = await tx.user.findUnique({
          where: {
            userName
          }
        })

        if (!checkUser) {
          throw new Error("User not found")
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password)

        if (!checkPassword) {
          throw new Error("Password is incorrect")
        }

        const payload = checkUser
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

        return token
      })

      res.status(200).json({
        message: `Login user successfully`,
        token: result
       })

    } catch (error) {
      next(error)
    }
  }
}