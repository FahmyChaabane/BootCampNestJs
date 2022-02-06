import { User } from './user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // data contains data provided to the decorator (args normalement)
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
