import { Module } from '@nestjs/common';
import { FriendInvitationsService } from './friend-invitations.service';
import { FriendInvitationsController } from './friend-invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendInvitation,
  FriendInvitationSchema,
} from './entities/friend-invitation.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendInvitation.name, schema: FriendInvitationSchema },
    ]),
    FriendsModule,
    ChatRoomsModule,
  ],
  controllers: [FriendInvitationsController],
  providers: [FriendInvitationsService],
})
export class FriendInvitationsModule {}
