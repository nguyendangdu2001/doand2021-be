import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type FriendDocument = Friend & Document;
@Schema({ timestamps: true })
export class Friend extends Document {
  @Prop({ type: Types.ObjectId })
  users: Types.ObjectId[];
  @Prop()
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
export const FriendSchema = SchemaFactory.createForClass(Friend);
