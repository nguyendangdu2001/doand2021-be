import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { ChatRoomsService } from './chat-rooms/chat-rooms.service';
import { Public } from './common/decorators';
import { SocketSessionGuard } from './common/guards/socket-session.guard';
import { IConnectedSocket } from './common/interfaces/connected-socket';
@UseGuards(SocketSessionGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private chatRoomService: ChatRoomsService,
  ) {}
  @WebSocketServer()
  private server: Server;
  async handleDisconnect(client: IConnectedSocket) {
    console.log(client.data, 'disconnect');

    const rooms = await this.chatRoomService.removeVideoRoomByUser(
      client.data.user?._id,
    );
    console.log(rooms);

    this.server
      .to(`videocall-${rooms?.of}`)
      .emit('offCall', { userId: client.data.user?._id });
  }
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
    console.log('logout');

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
