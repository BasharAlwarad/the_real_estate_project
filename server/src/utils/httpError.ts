export const throwHttpError = (message, status = 500) => {
  const error = new Error(message) as Error & { cause?: { status } };
  error.cause = { status };
  throw error;
};

/**
 * Common HTTP error functions for frequently used status codes
 */
export const httpErrors = {
  badRequest: (message = 'Bad Request') => throwHttpError(message, 400),
  notFound: (message = 'Not Found') => throwHttpError(message, 404),
  conflict: (message = 'Conflict') => throwHttpError(message, 409),
  internalServer: (message = 'Internal Server Error') =>
    throwHttpError(message, 500),
};
