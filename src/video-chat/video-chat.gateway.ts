import { UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Connection, Types } from 'mongoose';
import { Server } from 'socket.io';
import { ChatRoomsGateway } from 'src/chat-rooms/chat-rooms.gateway';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { WsUser } from 'src/common/decorators/wsUser';
import { SocketSessionGuard } from 'src/common/guards/socket-session.guard';
import { IConnectedSocket } from 'src/common/interfaces/connected-socket';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { VideoChatService } from './video-chat.service';

@UseGuards(SocketSessionGuard)
@WebSocketGateway()
export class VideoChatGateway {
  constructor(
    private readonly videoChatService: VideoChatService,
    private readonly userService: UsersService,
    private readonly chatRoomGateway: ChatRoomsGateway,
    private readonly chatRoomService: ChatRoomsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('sendVideoCallInvitation')
  handleVideoCallInvitation(
    @MessageBody() data: { to: string; fromUser: string; roomId: string },
    @WsUser() user: UserEntity,
  ) {
    this.server
      .to(data?.to)
      .emit('videoCallInvitaion', { from: user, roomId: data?.roomId });
  }
  @SubscribeMessage('acceptVideoCallInvitation')
  async acceptVideoCallInvitation(
    @MessageBody() data: { to: string; from: string; roomId: string },
    @WsUser() user: UserEntity,
  ) {
    this.server
      .to(data?.to)
      .emit('acceptVideoCallInvitation', { from: data?.from });
    return { message: 'success' };
  }
  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any, @WsUser() user: UserEntity) {
    this.server.to(data?.toId).emit('offer', data);
  }
  @SubscribeMessage('joinVideoCallRoom')
  async joinVideoCallRoom(
    @MessageBody() data: any,
    @WsUser() user: UserEntity,
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    socket.join(`videocall-${data?.roomId}`);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const room = await this.chatRoomService.getOrcreateFriendVideoChatRoom(
        data?.roomId,
      );
      socket.emit('otherUser', room?.usersId);
      await room?.updateOne({
        $addToSet: { usersId: new Types.ObjectId(user?._id) },
      });
      await session.commitTransaction();
      socket.broadcast
        .to(`videocall-${data?.roomId}`)
        .emit('userJoinVideoCallRoom', user?._id);
    } catch (error) {
      session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return { message: 'success' };
  }
  @SubscribeMessage('offCall')
  async offCall(
    @MessageBody() data: any,
    @WsUser() user: UserEntity,
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    socket.leave(`videocall-${data?.roomId}`);
    socket.broadcast
      .to(`videocall-${data?.roomId}`)
      .emit('offCall', { userId: user?._id });
    await this.chatRoomService.removeVideoRoom(data?.roomId);
  }
  @SubscribeMessage('leaveVideoCallRoom')
  async leaveVideoCallRoom(
    @MessageBody() data: any,
    @WsUser() user: UserEntity,
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    socket.leave(`videocall-${data?.roomId}`);
  }
  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, @WsUser() user: UserEntity) {
    this.server.to(data?.toId).emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  onIceCandidate(@MessageBody() data: any, @WsUser() user: UserEntity) {
    this.server.to(data?.toId).emit('ice-candidate', data.candidate);
  }
}
