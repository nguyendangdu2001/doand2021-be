import { Test, TestingModule } from '@nestjs/testing';
import { FriendInvitationsGateway } from './friend-invitations.gateway';

describe('FriendInvitationsGateway', () => {
  let gateway: FriendInvitationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendInvitationsGateway],
    }).compile();

    gateway = module.get<FriendInvitationsGateway>(FriendInvitationsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
