import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
	@IsString()
	@IsNotEmpty()
	@Expose()
	content: string;
}
