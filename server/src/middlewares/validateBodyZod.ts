import { httpErrors } from '#utils';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from 'zod';
import * as z from 'zod';

interface ValidateBodyZodOptions {
  zodSchema: ZodSchema<any>;
}
// Removed unnecessary interface ZodValidationIssue

const validateBodyZod =
  (zodSchema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = zodSchema.safeParse(req.body);
    if (!result.success) {
      // Format Zod validation errors
      const errorMessages = result.error.issues.map(
        (err: ZodIssue) => `${err.path.join('.')}: ${err.message}`
      );

      httpErrors.badRequest(`Validation failed: ${errorMessages.join(', ')}`);
    } else {
      req.body = result.data;
      next();
    }
  };

export default validateBodyZod;
