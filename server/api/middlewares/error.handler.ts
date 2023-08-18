import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../types/types';

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const errors: ResponseHandler<Error> = {
    isSuccessful: false,
    data: null,
    statusCode: err.status || 500,
    message: err.message,
    status: JSON.stringify(err.errors)
  }
  
  res.status(err.status || 500).send(errors)
}
