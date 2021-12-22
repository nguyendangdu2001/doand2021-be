import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { IConnectedSocket } from '../interfaces/connected-socket';

export const WsUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient<IConnectedSocket>();
    return (request?.data?.user as UserEntity) || null;
  },
);
