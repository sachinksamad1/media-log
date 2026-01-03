import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Parse the incoming request data
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      /**
       * 2. THE FIX:
       * Instead of req.query = parsed.query (which fails),
       * we use Object.assign to update the properties inside the object.
       */
      Object.assign(req.params, parsed.params);
      Object.assign(req.query, parsed.query);
      req.body = parsed.body; // Overwriting req.body is usually allowed in Express

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for your Flutter/Angular apps
        const details = error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));

        return next(
          new AppError(`Validation Failed: ${JSON.stringify(details)}`, 400)
        );
      }
      return next(error);
    }
  };
};
