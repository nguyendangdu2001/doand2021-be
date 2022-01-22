import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Message, MessageSchema } from 'src/messages/entities/message.entity';
import { User, UserEntity } from 'src/users/entities/user.entity';
export type ChatRoomDocument = ChatRoom & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ChatRoom {
  @Prop({ type: [Types.ObjectId], ref: User.name })
  usersId: Types.ObjectId[];
  users?: UserEntity[];
  @Prop()
  type: string;
  @Prop({ type: MessageSchema })
  lastMessage?: Message;
  @Prop({ type: Types.ObjectId, ref: ChatRoom.name })
  of?: Types.ObjectId;
  @Prop()
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
ChatRoomSchema.virtual('users', {
  localField: 'usersId',
  ref: User.name,
  foreignField: '_id',
});
