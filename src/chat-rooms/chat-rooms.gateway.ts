import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketSessionGuard } from 'src/common/guards/socket-session.guard';
import { IConnectedSocket } from 'src/common/interfaces/connected-socket';
import { User } from 'src/users/entities/user.entity';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoom } from './entities/chat-room.entity';

// @UseGuards(SocketSessionGuard)
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

  async newPrivateVideoCallInvitation(from: User, roomId: string) {
    const room = await this.chatRoomsService.findOne(roomId);
    const otherId = room?.usersId?.find(
      (v) => v?.toString() !== from?._id?.toString(),
    );
    this.server
      .to(otherId?.toString())
      .emit('privateVideoCallInvitation', { from });
  }

  newChatRoom(userId: string, chatRoom: ChatRoom) {
    this.server.to(userId).emit('newChatRoom', chatRoom);
  }
  handleOffer(roomId: string, payload) {
    this.server.to(roomId).emit('offer', payload);
  }
  handleAnswer(roomId: string, payload) {
    this.server.to(roomId).emit('offer', payload);
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
