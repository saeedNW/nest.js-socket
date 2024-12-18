import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as mongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
import { MessageType } from "../enum/message-type.enum";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
	@Prop({ required: true })
	endpoint: string;

	@Prop({ type: mongooseSchema.Types.ObjectId, ref: "User", required: true })
	sender: User;
	
	@Prop({ required: true })
	content: string;

	@Prop({ required: true, enum: MessageType })
	type: string;

	@Prop({ default: Date.now })
	timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
