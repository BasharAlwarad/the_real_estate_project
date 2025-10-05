import { httpErrors } from '#utils';

export const validateBodyZod = (zodSchema) => (req, res, next) => {
  const result = zodSchema.safeParse(req.body);
  if (!result.success) {
    // Format Zod validation errors
    const errorMessages = result.error.issues.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    );

    httpErrors.badRequest(`Validation failed: ${errorMessages.join(', ')}`);
  } else {
    req.body = result.data;
    next();
  }
};

export default validateBodyZod;
