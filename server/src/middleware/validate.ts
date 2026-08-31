import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema, source: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(400).json({ error: "Validation failed", details: messages });
        return;
      }
      next(err);
    }
  };
}
