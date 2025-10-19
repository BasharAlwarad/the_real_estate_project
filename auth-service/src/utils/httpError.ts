/**
 * HTTP Error utility functions
 */

class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

export const httpErrors = {
  badRequest: (message: string = 'Bad Request'): never => {
    throw new HttpError(message, 400);
  },
  unauthorized: (message: string = 'Unauthorized'): never => {
    throw new HttpError(message, 401);
  },
  forbidden: (message: string = 'Forbidden'): never => {
    throw new HttpError(message, 403);
  },
  notFound: (message: string = 'Not Found'): never => {
    throw new HttpError(message, 404);
  },
  conflict: (message: string = 'Conflict'): never => {
    throw new HttpError(message, 409);
  },
  unprocessableEntity: (message: string = 'Unprocessable Entity'): never => {
    throw new HttpError(message, 422);
  },
  internalServerError: (message: string = 'Internal Server Error'): never => {
    throw new HttpError(message, 500);
  },
};
