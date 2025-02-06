import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const id = context.switchToHttp().getRequest().user.id;
    const token = this.jwtService.sign({ id });

    return next.handle().pipe(
      map((response) => {
        return { response, token };
      }),
    );
  }
}
