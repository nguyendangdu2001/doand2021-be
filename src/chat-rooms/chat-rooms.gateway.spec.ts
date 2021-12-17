import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsGateway } from './chat-rooms.gateway';

describe('ChatRoomsGateway', () => {
  let gateway: ChatRoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomsGateway],
    }).compile();

    gateway = module.get<ChatRoomsGateway>(ChatRoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
