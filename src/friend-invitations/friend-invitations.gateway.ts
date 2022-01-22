import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class FriendInvitationsGateway {
  @WebSocketServer()
  private server: Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  newFriendInvitaiton(userId: string) {
    this.server.to(userId).emit('newFriendInvitation');
  }
}
