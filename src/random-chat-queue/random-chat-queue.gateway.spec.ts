import { Test, TestingModule } from '@nestjs/testing';
import { RandomChatQueueGateway } from './random-chat-queue.gateway';
import { RandomChatQueueService } from './random-chat-queue.service';

describe('RandomChatQueueGateway', () => {
  let gateway: RandomChatQueueGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomChatQueueGateway, RandomChatQueueService],
    }).compile();

    gateway = module.get<RandomChatQueueGateway>(RandomChatQueueGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
