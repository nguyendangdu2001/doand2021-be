import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendInvitationDto } from './create-friend-invitation.dto';

export class UpdateFriendInvitationDto extends PartialType(
  CreateFriendInvitationDto,
) {}
