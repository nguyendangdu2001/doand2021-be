import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Message, MessageSchema } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
export type ChatRoomDocument = ChatRoom & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ChatRoom extends Document {
  @Prop({ type: [Types.ObjectId], ref: User.name })
  usersId: Types.ObjectId[];
  users?: User[];
  @Prop()
  type: string;
  @Prop({ type: MessageSchema })
  lastMessage?: Message;
  @Prop({ type: Types.ObjectId, ref: ChatRoom.name })
  of?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
ChatRoomSchema.virtual('users', {
  localField: 'usersId',
  ref: User.name,
  foreignField: '_id',
});
