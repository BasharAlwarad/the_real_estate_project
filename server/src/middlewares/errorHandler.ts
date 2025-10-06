import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`\x1b[31m${err.stack}\x1b[0m`);
  }

  // Handle custom errors with status codes
  const errorWithCause = err as Error & { cause: { status: number } };
  if (err instanceof Error && errorWithCause.cause) {
    return res
      .status(errorWithCause.cause.status)
      .json({ message: err.message });
  }

  // Handle standard errors
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
};
