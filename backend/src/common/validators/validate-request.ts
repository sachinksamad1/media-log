import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';

import { AppError } from '../errors/app-error.js';

export const validate =
  <T extends ZodTypeAny>(schema: T) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // If content-type is multipart/form-data, req.body might be a JSON string under 'data' key
      // We need to parse it BEFORE passing to schema for validation
      let bodyToValidate = req.body;
      if (
        req.headers['content-type']?.includes('multipart/form-data') &&
        typeof req.body.data === 'string'
      ) {
        try {
          bodyToValidate = JSON.parse(req.body.data);
          // Merge parsed data into req.body so subsequent middleware/controllers see it
          req.body = { ...req.body, ...bodyToValidate };
        } catch {
          // ignore parse error here, let schema validation fail if structure is invalid
        }
      } else if (
        req.headers['content-type']?.includes('multipart/form-data') &&
        req.body.data === undefined
      ) {
        // handle case where no data field is sent in multipart but fields are sent directly
        // no-op
      }

      const parsed = await schema.parseAsync({
        body: bodyToValidate,
        query: req.query,
        params: req.params,
      });

      // Overwrite request with validated data
      /* eslint-disable @typescript-eslint/no-explicit-any */
      req.body = (parsed as any).body;

      try {
        req.query = (parsed as any).query;
      } catch {
        // Fallback for read-only query property: mutate the object
        Object.keys(req.query).forEach((k) => delete (req.query as any)[k]);
        Object.assign(req.query, (parsed as any).query);
      }

      try {
        req.params = (parsed as any).params;
      } catch {
        // Fallback for read-only params property: mutate the object
        Object.keys(req.params).forEach((k) => delete (req.params as any)[k]);
        Object.assign(req.params, (parsed as any).params);
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        return next(
          new AppError(`Validation failed: ${JSON.stringify(details)}`, 400),
        );
      }

      next(error);
    }
  };
