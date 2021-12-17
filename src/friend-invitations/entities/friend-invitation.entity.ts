import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export type FriendInvitationDocument = FriendInvitation & Document;
@Schema({ timestamps: true })
export class FriendInvitation extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  from: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  to: Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
}

const FriendInvitationSchema = SchemaFactory.createForClass(FriendInvitation);
FriendInvitationSchema.index({ from: 1, to: 1 });
export { FriendInvitationSchema };
