import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

class Otp {
	@Prop({ required: true })
	code: string;

	@Prop({ required: true })
	expires_in: Date;
}

@Schema()
export class User {
	@Prop({ required: true })
	phone: string;

	@Prop()
	username: string;

	@Prop()
	profileImage: string;

	@Prop({ type: Otp })
	otp: Otp;
}

export const UserSchema = SchemaFactory.createForClass(User);
