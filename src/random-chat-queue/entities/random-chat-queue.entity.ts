import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export type RandomChatQueueDocument = RandomChatQueue & Document;
@Schema()
export class RandomChatQueue {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}

export const RandomChatQueueSchema =
  SchemaFactory.createForClass(RandomChatQueue);
