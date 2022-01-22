import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRandomChatQueueDto } from './dto/create-random-chat-queue.dto';
import { UpdateRandomChatQueueDto } from './dto/update-random-chat-queue.dto';
import {
  RandomChatQueue,
  RandomChatQueueDocument,
} from './entities/random-chat-queue.entity';

@Injectable()
export class RandomChatQueueService {
  constructor(
    @InjectModel(RandomChatQueue.name)
    private readonly randomChatQueueModel: Model<RandomChatQueueDocument>,
  ) {}
  create(createRandomChatQueueDto: CreateRandomChatQueueDto) {
    return this.randomChatQueueModel.create(createRandomChatQueueDto);
  }

  findAll() {
    return `This action returns all randomChatQueue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} randomChatQueue`;
  }
  findAny() {
    return this.randomChatQueueModel.findOneAndDelete({});
  }

  update(id: number, updateRandomChatQueueDto: UpdateRandomChatQueueDto) {
    return `This action updates a #${id} randomChatQueue`;
  }

  remove(id: string) {
    return this.randomChatQueueModel.findByIdAndDelete(id);
  }
}
