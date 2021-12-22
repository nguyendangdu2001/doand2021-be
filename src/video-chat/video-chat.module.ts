import { Module } from '@nestjs/common';
import { VideoChatService } from './video-chat.service';
import { VideoChatGateway } from './video-chat.gateway';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [VideoChatGateway, VideoChatService],
  imports: [ChatRoomsModule, UsersModule, AuthModule],
})
export class VideoChatModule {}
