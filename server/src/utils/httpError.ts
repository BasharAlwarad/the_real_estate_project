interface HttpErrorCause {
  status: number;
}

interface HttpError extends Error {
  cause?: HttpErrorCause;
}

export const throwHttpError = (
  message: string,
  status: number = 500
): never => {
  const error = new Error(message) as HttpError;
  error.cause = { status };
  throw error;
};

/**
 * Common HTTP error functions for frequently used status codes
 */
export const httpErrors = {
  badRequest: (message = 'Bad Request') => throwHttpError(message, 400),
  unauthorized: (message = 'Unauthorized') => throwHttpError(message, 401),
  forbidden: (message = 'Forbidden') => throwHttpError(message, 403),
  notFound: (message = 'Not Found') => throwHttpError(message, 404),
  methodNotAllowed: (message = 'Method Not Allowed') =>
    throwHttpError(message, 405),
  conflict: (message = 'Conflict') => throwHttpError(message, 409),
  unprocessableEntity: (message = 'Unprocessable Entity') =>
    throwHttpError(message, 422),
  tooManyRequests: (message = 'Too Many Requests') =>
    throwHttpError(message, 429),
  internalServer: (message = 'Internal Server Error') =>
    throwHttpError(message, 500),
  notImplemented: (message = 'Not Implemented') => throwHttpError(message, 501),
  serviceUnavailable: (message = 'Service Unavailable') =>
    throwHttpError(message, 503),
};
