import { HttpException, HttpStatus } from '@nestjs/common';

export const throwError = (
  message: string | any,
  statusCode?: number,
): HttpException => {
  return new HttpException(
    message,
    statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
