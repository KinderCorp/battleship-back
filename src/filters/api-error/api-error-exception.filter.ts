import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ErrorCodes } from '@interfaces/error.interface';

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
        ? exceptionResponse
        : (exceptionResponse as { message: string; error: string }).message;

    response.status(status).send({
      code: ErrorCodes.NOT_FOUND,
      detail: exceptionResponse,
      message: error,
    });
  }
}
