import { AppError } from '@common/errors/app-error.js';
import type { Request, Response, NextFunction } from 'express';
import { ZodError, type z } from 'zod';

type RequestSchema = z.ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}>;

export const validate =
  <T extends RequestSchema>(schema: T) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let bodyToValidate = req.body ?? {};

      // eslint-disable-next-line no-console
      console.log('Validate Request - Headers:', req.headers['content-type']);
      // eslint-disable-next-line no-console
      console.log(
        'Validate Request - Initial Body keys:',
        Object.keys(bodyToValidate),
      );

      if (
        req.headers['content-type']?.includes('multipart/form-data') &&
        typeof req.body?.data === 'string'
      ) {
        try {
          bodyToValidate = JSON.parse(req.body.data);
          req.body = { ...req.body, ...bodyToValidate };
        } catch {
          // let schema validation fail
        }
      }

      const parsed = await schema.parseAsync({
        body: bodyToValidate,
        query: req.query,
        params: req.params,
      });

      // Assign validated data
      if (parsed.body !== undefined) {
        req.body = parsed.body as Request['body'];
      }

      if (parsed.query) {
        Object.assign(req.query, parsed.query);
      }
      if (parsed.params) {
        Object.assign(req.params, parsed.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        // eslint-disable-next-line no-console
        console.error('Validation Warning:', JSON.stringify(details, null, 2));

        return next(
          new AppError(`Validation failed: ${JSON.stringify(details)}`, 400),
        );
      }

      next(error);
    }
  };
