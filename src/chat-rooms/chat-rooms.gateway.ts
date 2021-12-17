import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IConnectedSocket } from 'src/common/interfaces/connected-socket';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoom } from './entities/chat-room.entity';

@WebSocketGateway()
export class ChatRoomsGateway {
  constructor(
    @Inject(forwardRef(() => ChatRoomsService))
    private readonly chatRoomsService: ChatRoomsService,
  ) {}
  private readonly logger = new Logger(ChatRoomsGateway.name);
  @WebSocketServer()
  private server: Server;
  @SubscribeMessage('getInitialChatRooms')
  async handleMessage(@ConnectedSocket() socket: IConnectedSocket) {
    return await this.chatRoomsService.findAllForUser(socket.data?.user?.id);
  }
  @SubscribeMessage('joinChatRoom')
  async join(
    @ConnectedSocket() socket: IConnectedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    this.logger.log(`User:${socket.data?.user?._id} join Room:${data?.roomId}`);
    socket.join(data.roomId);
    return { message: 'Success' };
  }
  @SubscribeMessage('leaveChatRoom')
  async leave(
    @ConnectedSocket() socket: IConnectedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    this.logger.log(
      `User:${socket.data?.user?._id} leaves Room:${data?.roomId}`,
    );
    socket.leave(data.roomId);
    return { message: 'Success' };
  }

  newChatRoom(userId: string, chatRoom: ChatRoom) {
    this.server.to(userId).emit('newChatRoom', chatRoom);
  }
  newChatRoomMessage(chatRoom: ChatRoom) {
    console.log('ẹmit newChatRoomMessage', chatRoom);

    chatRoom.usersId?.map((v) => {
      this.server.to(v?.toString()).emit('newChatRoomMessage', chatRoom);
    });
    // this.server
    //   .to(chatRoom.id)
    //   .except(chatRoom.lastMessage.)
    //   .emit('newMessages', chatRoom.lastMessage);
  }
}
