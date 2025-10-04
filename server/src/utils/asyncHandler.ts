import { Request, Response, NextFunction } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (fn: AsyncController) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
