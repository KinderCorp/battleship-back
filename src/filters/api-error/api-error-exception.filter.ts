import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import ApiError from '@shared/api-error';
import { FastifyReply } from 'fastify';

type ErrorObject = {
  statusCode?: number;
  message: string;
  error?: string;
};

@Catch(HttpException)
export default class ApiErrorExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  public catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: FastifyReply<any> = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof response === 'string'
        ? ({ message: exceptionResponse } as ErrorObject)
        : (exceptionResponse as ErrorObject);

    response.status(status).send(
      exception instanceof ApiError
        ? exceptionResponse
        : {
            code: this.getTextStatusFromCode(status),
            detail: `This error hasn't been properly handled : ${error.message}`,
            stack: exception?.stack,
            status,
            title: error.error ?? 'Unhandled exception has been catch',
          },
    );
  }

  public getTextStatusFromCode(statusCode: HttpStatus) {
    const indexOfStatusCode = Object.values(HttpStatus).indexOf(
      statusCode as unknown as HttpStatus,
    );
    return Object.keys(HttpStatus)[indexOfStatusCode];
  }
}
