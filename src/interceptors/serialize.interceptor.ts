import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something nbefore a request is handled by the request handler
    console.log('Im running before the habdler', context);
    return next.handle().pipe(
      map((data: any) => {
        // Run something before the respose is sent out
        console.log('Im running before the response is sent', data);
      }),
    );
  }
}
