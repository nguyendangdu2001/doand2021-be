import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorators';
import { SocketSessionGuard } from './common/guards/socket-session.guard';
import { IConnectedSocket } from './common/interfaces/connected-socket';
@UseGuards(SocketSessionGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  constructor(private authService: AuthService) {}
  @SubscribeMessage('whoami')
  handleMessage(@ConnectedSocket() socket: IConnectedSocket) {
    console.log(socket.data);
    return socket.data?.user;
  }
  @Public()
  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() socket: IConnectedSocket,
    @MessageBody() data: { token: string },
  ) {
    console.log('dadfsdfdsf', data);
    const user = await this.authService.validateWsUser(data?.token);
    console.log(socket.data);
    socket.data = { user, token: data?.token };
    console.log(socket.data);

    socket.join(user.id);
    return { message: 'Success' };
  }
  @SubscribeMessage('logout')
  async handleLogout(@ConnectedSocket() socket: IConnectedSocket) {
    socket.leave(socket.data?.user?.id);
    socket.data = {};

    return { message: 'Success' };
  }
  async handleConnection(client: Socket) {
    if (client.handshake.auth?.token) {
      try {
        const user = await this.authService.validateWsUser(
          client.handshake.auth?.token,
        );
        client.data = { user, token: client.handshake.auth?.token };
        console.log(user.id);

        client.join(user.id);
      } catch (error) {}
    }
  }
}
