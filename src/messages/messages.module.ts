import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import {
  AudioMessage,
  AudioMessageSchema,
  MediaMessage,
  MediaMessageSchema,
  Message,
  MessageSchema,
  TextMessage,
  TextMessageSchema,
} from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
        discriminators: [
          { name: TextMessage.name, schema: TextMessageSchema },
          { name: MediaMessage.name, schema: MediaMessageSchema },
          { name: AudioMessage.name, schema: AudioMessageSchema },
        ],
      },
    ]),
    ChatRoomsModule,
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
