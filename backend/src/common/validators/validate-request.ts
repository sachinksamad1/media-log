import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validates and automatically strips unknown fields (if not .passthrough())
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Re-assign parsed data to ensure type-safety and cleaned values
      req.body = parsed.body;
      req.query = parsed.query as any;
      req.params = parsed.params as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Standardize the error response for your Angular/Flutter apps
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error); // Pass other errors to global error handler
    }
  };
