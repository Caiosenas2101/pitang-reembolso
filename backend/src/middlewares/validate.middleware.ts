import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

type RequestSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((issue) => issue.message).join("; ");
        throw new AppError(message, 400, "Bad Request");
      }

      throw error;
    }
  };
}
