import { Module } from '@nestjs/common';
import { RandomChatQueueService } from './random-chat-queue.service';
import { RandomChatQueueGateway } from './random-chat-queue.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RandomChatQueue,
  RandomChatQueueSchema,
} from './entities/random-chat-queue.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: RandomChatQueueSchema, name: RandomChatQueue.name },
    ]),
  ],
  providers: [RandomChatQueueGateway, RandomChatQueueService],
  exports: [RandomChatQueueService],
})
export class RandomChatQueueModule {}
