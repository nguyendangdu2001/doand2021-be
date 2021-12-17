// import { Request } from 'express';
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
// import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthenticatedGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  // getRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req;
  // }
}
