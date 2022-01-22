import { Test, TestingModule } from '@nestjs/testing';
import { RandomChatQueueService } from './random-chat-queue.service';

describe('RandomChatQueueService', () => {
  let service: RandomChatQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomChatQueueService],
    }).compile();

    service = module.get<RandomChatQueueService>(RandomChatQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
