import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  success: false;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unknown error occurred',
      success: false,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorResponse.statusCode = exception.getStatus();

      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const message = exceptionResponse.message;
        if (Array.isArray(message)) errorResponse.message = message[0];
        else if (typeof message === 'string') errorResponse.message = message;
      } else errorResponse.message = exception.message;
    } else if (exception instanceof Error)
      errorResponse.message = exception.message;

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
