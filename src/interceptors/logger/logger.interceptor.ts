import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const args = context.getArgs();
    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            //prettier-ignore
            `${args[1].statusCode} - ${args[0].method} - ${args[0].url} - ${Date.now() - now}ms`,
          ),
      }),
    );
  }
}
