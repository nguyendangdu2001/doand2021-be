import { OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export type MessageDocument = Message & Document;
export type MediaMessageDocument = MediaMessage & Document;
export type TextMessageDocument = TextMessage & Document;
export type AudioMessageDocument = AudioMessage & Document;
@Schema({
  timestamps: true,
  discriminatorKey: 'kind',
  toJSON: { virtuals: true },
})
export class Message {
  @Prop({ type: Types.ObjectId, ref: User.name })
  to: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  from: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Message.name })
  replyId: Types.ObjectId;
  @Prop()
  kind: string;
  @Prop()
  deleted: boolean;
  fromUser: User;
  replyComment: Message;
  createdAt: Date;
  updatedAt: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.virtual('fromUser', {
  ref: User.name,
  localField: 'from',
  foreignField: '_id',
});
MessageSchema.virtual('replyComment', {
  ref: Message.name,
  localField: 'replyId',
  foreignField: '_id',
});
class BaseMessage extends OmitType(Message, ['kind']) {
  kind: string;
}

@Schema()
export class TextMessage extends BaseMessage {
  @Prop()
  content: string;
}
// const a = new TextMessage();
export const TextMessageSchema = SchemaFactory.createForClass(TextMessage);
@Schema()
export class MediaMessage extends BaseMessage {
  @Prop()
  content: string;

  @Prop({ type: [String] })
  media: string[];
}
export const MediaMessageSchema = SchemaFactory.createForClass(MediaMessage);
@Schema()
export class AudioMessage extends BaseMessage {
  @Prop()
  content: string;

  @Prop()
  media: string;
}
export const AudioMessageSchema = SchemaFactory.createForClass(AudioMessage);
