import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { FriendsService } from 'src/friends/friends.service';
import { CreateFriendInvitationDto } from './dto/create-friend-invitation.dto';
import { UpdateFriendInvitationDto } from './dto/update-friend-invitation.dto';
import {
  FriendInvitation,
  FriendInvitationDocument,
} from './entities/friend-invitation.entity';

@Injectable()
export class FriendInvitationsService {
  constructor(
    @InjectModel(FriendInvitation.name)
    private readonly friendInvitationModel: Model<FriendInvitationDocument>,
    private readonly friendService: FriendsService,
    private readonly chatRoomService: ChatRoomsService,
  ) {}
  async create(createFriendInvitationDto: CreateFriendInvitationDto) {
    return await this.friendInvitationModel.create(createFriendInvitationDto);
  }
  async acceptFriendInvitation(invitationId: string, userId: string) {
    console.log({ userId, invitationId });
    const invitation = await this.friendInvitationModel.findOneAndDelete({
      _id: new Types.ObjectId(invitationId),
      to: new Types.ObjectId(userId),
    });
    console.log(invitation);
    const friend = await this.friendService.create({
      users: [invitation.from, invitation.to],
      type: 'FRIEND',
    });
    return await this.chatRoomService.createFriendChatRoom({
      usersId: friend.users,
      type: 'PRIVATE',
    });
  }

  findAll() {
    return `This action returns all friendInvitations`;
  }
  async findAllForUser(userId: string) {
    return await this.friendInvitationModel
      .find({ to: userId })
      .populate('from');
  }

  findOne(id: number) {
    return `This action returns a #${id} friendInvitation`;
  }

  update(id: number, updateFriendInvitationDto: UpdateFriendInvitationDto) {
    return `This action updates a #${id} friendInvitation`;
  }

  async remove(id: string) {
    return await this.friendInvitationModel.findByIdAndDelete(id);
  }
}
