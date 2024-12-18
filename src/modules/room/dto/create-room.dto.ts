import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsOptional,
	Length,
} from "class-validator";
import { RoomType } from "../enum/room-type.enum";
import { Expose } from "class-transformer";
import { MongoIdArray } from "../decorators/mongo-id-array.decorator";

export class CreateRoomDto {
	@IsEnum(RoomType, { message: "invalid room type" })
	@Expose()
	type: RoomType;

	@IsArray({ message: "users must be an array" })
	@ArrayNotEmpty({ message: "users array should not be empty" })
	@MongoIdArray({ message: "each user ID must be a valid MongoDB ObjectId" })
	@Expose()
	users: string[];

	@IsOptional()
	@Length(5, 100, {
		message: "group name should be between 5 to 100 characters",
	})
	@Expose()
	name: string;
}
