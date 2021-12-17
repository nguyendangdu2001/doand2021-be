import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message, MessageSchema } from 'src/messages/entities/message.entity';
export type RelationDocument = Relation & Document;
@Schema({ timestamps: true })
export class Relation {
  @Prop({ type: Types.ObjectId })
  users: Types.ObjectId[];
  @Prop()
  type: string;
  @Prop({ type: MessageSchema })
  lastMessage: Message;
  createdAt: Date;
  updatedAt: Date;
}
export const RelationSchema = SchemaFactory.createForClass(Relation);
