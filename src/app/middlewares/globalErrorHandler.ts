/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode: number = 500;
  let message: string = 'Something went wrong!';

  if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
  } else if (error instanceof Error) {
    message = error?.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
