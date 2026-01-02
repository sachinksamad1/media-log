import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any[] = [];

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Failed";
    errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  // Handle Firestore / Database Errors (Optional)
  if (err.code === "unavailable") {
    statusCode = 503;
    message = "Database is currently offline";
  }

  // Standardized Response Format for Angular/Flutter
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack in production
  });
};
