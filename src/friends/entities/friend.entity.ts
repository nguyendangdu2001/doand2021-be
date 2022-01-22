import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export type FriendDocument = Friend & Document;
@Schema({ timestamps: true })
export class Friend extends Document {
  @Prop({ type: [Types.ObjectId], ref: User.name })
  users: Types.ObjectId[];
  @Prop()
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
export const FriendSchema = SchemaFactory.createForClass(Friend);
