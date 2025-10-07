import { type ErrorRequestHandler } from 'express';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    // Create log directory if it doesn't exist
    const logDir = join(process.cwd(), 'log');
    await mkdir(logDir, { recursive: true });
    // Generate filename based on current date (yyyy-mm-dd-error.log)
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // Gets yyyy-mm-dd format
    const logFilePath = join(logDir, `${dateString}-error.log`);
    // Create log entry with timestamp and error details
    const timestamp = now.toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.url} - Error: ${err.message} - Stack: ${err.stack}\n`;
    // Append to log file (creates file if it doesn't exist)
    await appendFile(logFilePath, logEntry, 'utf8');
  } catch (logError: unknown) {
    if (process.env.NODE_ENV !== 'development') {
      if (logError instanceof Error) {
        console.error(`\x1b[31m${logError.stack}\x1b[0m`);
      } else {
        console.error(`\x1b[31m${logError}\x1b[0m`);
      }
    }
  }

  // Extract status code from err.cause.status, default to 500
  const statusCode = err.cause?.status || 500;
  res.status(statusCode).json({ message: err.message });
};

export default errorHandler;

// import { Request, Response, NextFunction } from 'express';

// export const errorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // Log error in development
//   if (process.env.NODE_ENV !== 'production') {
//     console.error(`\x1b[31m${err.stack}\x1b[0m`);
//   }

//   // Handle custom errors with status codes
//   const errorWithCause = err as Error & { cause: { status: number } };
//   if (err instanceof Error && errorWithCause.cause) {
//     return res
//       .status(errorWithCause.cause.status)
//       .json({ message: err.message });
//   }

//   // Handle standard errors
//   const message = err instanceof Error ? err.message : 'Internal server error';
//   res.status(500).json({ message });
// };
