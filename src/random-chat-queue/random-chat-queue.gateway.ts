import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { RandomChatQueueService } from './random-chat-queue.service';
import { CreateRandomChatQueueDto } from './dto/create-random-chat-queue.dto';
import { UpdateRandomChatQueueDto } from './dto/update-random-chat-queue.dto';
import { WsUser } from 'src/common/decorators/wsUser';
import { UserEntity } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';
import { Server } from 'socket.io';

@WebSocketGateway()
export class RandomChatQueueGateway {
  constructor(
    private readonly randomChatQueueService: RandomChatQueueService,
  ) {}
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('createRandomChatQueue')
  create(@MessageBody() createRandomChatQueueDto: CreateRandomChatQueueDto) {
    return this.randomChatQueueService.create(createRandomChatQueueDto);
  }

  @SubscribeMessage('joinRandomVideoCall')
  async findAll(@WsUser() user: UserEntity) {
    const waitingUser = await this.randomChatQueueService.findAny();
    if (!waitingUser) {
      const queue = await this.create({ userId: new Types.ObjectId(user._id) });
      return { success: false, queue };
    }
    this.server
      .to(waitingUser?.userId?.toString())
      .emit('randomVideoCallStopWaiting');
    return { success: true, user: waitingUser };
  }

  @SubscribeMessage('removeRandomChatQueue')
  remove(@MessageBody() id: string) {
    return this.randomChatQueueService.remove(id);
  }
  @SubscribeMessage('leaveRandomVideoCall')
  leaveRandomVideoCall(@MessageBody() data: { toId: string }) {
    return this.server.to(data?.toId).emit('leaveRandomVideoCall');
  }
}
