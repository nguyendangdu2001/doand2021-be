import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // const args = ctx.getArgs();
    //

    // req.body.username = args.loginInput.userName;
    // req.body.password = args.loginInput.password;

    const result = (await super.canActivate(context)) as boolean;

    // res.cookies['test'] = 'adsf';
    // await super.logIn(req);

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
