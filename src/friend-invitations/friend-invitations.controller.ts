import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FriendInvitationsService } from './friend-invitations.service';
import { CreateFriendInvitationDto } from './dto/create-friend-invitation.dto';
import { UpdateFriendInvitationDto } from './dto/update-friend-invitation.dto';
import { User } from 'src/common/decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';
import { FriendInvitationsGateway } from './friend-invitations.gateway';

@Controller('friend-invitations')
export class FriendInvitationsController {
  constructor(
    private readonly friendInvitationsService: FriendInvitationsService,
    private readonly friendInvitationGateway: FriendInvitationsGateway,
  ) {}

  @Post()
  async create(
    @Body() createFriendInvitationDto: CreateFriendInvitationDto,
    @User() user: UserEntity,
  ) {
    const invitation = await this.friendInvitationsService.create({
      from: new Types.ObjectId(user.id),
      to: new Types.ObjectId(createFriendInvitationDto.to),
    });
    this.friendInvitationGateway.newFriendInvitaiton(
      createFriendInvitationDto.to?.toString(),
    );
    return invitation;
  }
  @Post('/action/decline/:id')
  decline(@Param('id') invitationId: string, @User() user: UserEntity) {
    return this.friendInvitationsService.remove(invitationId);
  }
  @Post('/action/accept/:id')
  accpet(@Param('id') invitationId: string, @User() user: UserEntity) {
    return this.friendInvitationsService.acceptFriendInvitation(
      invitationId,
      user.id,
    );
  }
  @Get()
  findAll(@User() user: UserEntity) {
    return this.friendInvitationsService.findAllForUser(user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendInvitationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFriendInvitationDto: UpdateFriendInvitationDto,
  ) {
    return this.friendInvitationsService.update(+id, updateFriendInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendInvitationsService.remove(id);
  }
}
