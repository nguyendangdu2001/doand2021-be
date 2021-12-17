// import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Event } from 'src/events/entities/event.entity';

export type UserDocument = User & Document;
export type UserEntity = User;
@Schema({ _id: false })
export class Google {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  name: string;
}

const GoogleSchema = SchemaFactory.createForClass(Google);

@Schema({ timestamps: true })
export class User extends Document {
  // @Prop({ alias: 'id', type: MongooseSchema.Types.ObjectId })
  // _id?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName: string;

  @Prop()
  userName?: string;

  @Prop({ select: false })
  password?: string;

  friends?: User[];

  events?: Event[];

  // @Field(() => [Post], { description: "user's post", nullable: true })
  // posts?: Post[];

  @Prop()
  avatar: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ type: GoogleSchema })
  google?: Google;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
