import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

// import { ApiErrorCodes } from '@interfaces/error.interface';

// type ErrorObject = {
//   code: ApiErrorCodes;
//   message: string | object;
//   title: string | object;
// };

// FIXME This is not working properly
@Catch(HttpException)
export default class ApiErrorExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  public catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: FastifyReply<any> = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    // const exceptionResponse = exception.getResponse();

    response.status(status).send(exception);
  }
}
