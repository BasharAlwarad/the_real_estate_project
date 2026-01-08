import { Request, Response, NextFunction } from 'express';

// Minimal teaching-friendly error handler: always 500
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err); // log so you can see the problem while learning

  res.status(500).json({ error: err.message || 'Something went wrong' });
};

export default errorHandler;
