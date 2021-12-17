import { PickType } from '@nestjs/mapped-types';
import { FriendInvitation } from '../entities/friend-invitation.entity';

export class CreateFriendInvitationDto extends PickType(FriendInvitation, [
  'from',
  'to',
]) {}
