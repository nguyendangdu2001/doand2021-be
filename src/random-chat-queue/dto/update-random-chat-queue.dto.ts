import { PartialType } from '@nestjs/mapped-types';
import { CreateRandomChatQueueDto } from './create-random-chat-queue.dto';

export class UpdateRandomChatQueueDto extends PartialType(CreateRandomChatQueueDto) {
  id: number;
}
