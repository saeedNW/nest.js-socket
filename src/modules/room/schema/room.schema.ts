import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as mongooseSchema } from "mongoose";
import { RoomType } from "../enum/room-type.enum";
import { User } from "src/modules/user/schema/user.schema";
import { v4 as uuidv4 } from "uuid";

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
	@Prop({ required: true, enum: RoomType })
	type: string;

	@Prop({
		type: [{ type: mongooseSchema.Types.ObjectId, ref: "User" }],
		required: true,
	})
	users: User[];

	@Prop()
	name: string;

	@Prop({ default: uuidv4, unique: true, required: true })
	endpoint: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
