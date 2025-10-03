import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import jwt from 'jsonwebtoken';

type ValidateTarget = "body" | "query" | "params";

export default {
  validateInput(schema: z.ZodSchema<any>, target: ValidateTarget ="body") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await schema.parseAsync(req[target]);
        req[target] = result
        next()
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.issues
          })
        }
        next(error)
      }
    }
  },
  jwtProtect: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers["authorization"];

      if (!authToken) {
        throw new Error("Unauthorized");
      }

      const jwtToken = authToken.split(" ")[1];

      if (typeof jwtToken !== "string") {
        throw new Error("Token is not valid");
      }

      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!);

      res.locals.user = decoded;
      
      next()
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token"})
      next(error)
    }
  }
}
