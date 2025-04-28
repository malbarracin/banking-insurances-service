import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop()
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  dni: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  _class: string;
}

export const UserSchema = SchemaFactory.createForClass(User);