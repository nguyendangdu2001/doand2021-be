import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    forwardRef(() => MessagesModule),
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, ChatRoomsGateway],
  exports: [ChatRoomsService, ChatRoomsGateway],
})
export class ChatRoomsModule {}
