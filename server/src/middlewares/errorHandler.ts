import { type ErrorRequestHandler } from 'express';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Express error handler middleware
 *
 * Handles errors by logging them to daily log files and sending appropriate responses.
 * Error logging schema is documented in: /docs/schemas/common.yaml
 */

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
