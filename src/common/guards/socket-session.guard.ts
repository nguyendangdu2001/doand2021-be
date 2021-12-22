import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { IConnectedSocket } from '../interfaces/connected-socket';

@Injectable()
export class SocketSessionGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }
    console.log('SocketSession activated');
    const client = context?.switchToWs()?.getClient<IConnectedSocket>();
    // console.log(client);
    const user = await this.authService.validateWsUser(
      client.data?.token || client?.handshake?.auth?.token,
    );
    console.log(user);
    if (user) {
      client.data.user = user;
      return true;
    }
    return false;
  }

  static async verifyToken(
    jwtService: JwtService,
    socket: IConnectedSocket,
    token?: string,
  ) {
    if (
      socket.conn.userId &&
      (await jwtService.verifyAsync(socket.conn.token))
    ) {
      return true;
    }

    if (!token) return false;

    socket.conn.token = token;
    const { sub } = await jwtService.decode(token);
    console.log(sub);

    socket.conn.userId = sub;
    console.log(`Setting connection userId to "${sub}"`);
    return true;
  }
}
