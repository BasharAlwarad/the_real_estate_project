import { httpErrors } from '#utils';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from 'zod';

interface ValidateBodyZodOptions {
  zodSchema: ZodSchema<any>;
}
// Removed unnecessary interface ZodValidationIssue

const validateBodyZod =
  (zodSchema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = zodSchema.safeParse(req.body);
    if (!result.success) {
      // Format Zod validation errors
      const errorMessages = result.error.issues.map(
        (err: ZodIssue) => `${err.path.join('.')}: ${err.message}`
      );

      const errorMessage = `Validation failed: ${errorMessages.join(', ')}`;

      res.status(400).json({
        success: false,
        message: errorMessage,
        errors: result.error.issues,
      });
      return;
    } else {
      req.body = result.data;
      next();
    }
  };

export default validateBodyZod;
