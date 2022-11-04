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
      tap(() =>
        this.logger.log(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `${args[1].statusCode} - ${args[0].method} - ${args[0].url} - ${args[0].method} - ${Date.now() - now}ms`,
        ),
      ),
    );
    return next.handle();
  }
}
