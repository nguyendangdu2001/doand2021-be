import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard
  extends AuthGuard('google-id-token')
  implements CanActivate
{
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // const ctx = GqlExecutionContext.create(context);
    const request = context.switchToHttp().getRequest();
    // const req = ctx.getContext().req;
    // req.body.id_token = ctx.getArgs().id_token;
    // console.log(ctx.getContext().req.logIn);

    console.log('go here');

    const result = (await super.canActivate(context)) as boolean;
    console.log('go here2');

    // res.cookies['test'] = 'adsf';
    // await super.logIn(request);

    return result;
  }
  // getRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req;
  // }

  // public handleRequest<User>(err: Error, user: User): User {
  //   if (err) {
  //     throw err;
  //   }
  //   return user;
  // }
}
