import { Module } from '@nestjs/common';
import { GroupVideoChatService } from './group-video-chat.service';
import { GroupVideoChatGateway } from './group-video-chat.gateway';

@Module({
  providers: [GroupVideoChatGateway, GroupVideoChatService]
})
export class GroupVideoChatModule {}
