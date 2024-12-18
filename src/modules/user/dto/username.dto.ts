import { Expose } from "class-transformer";
import { IsString, Length } from "class-validator";

export class UpdateUsernameDto {
	@IsString()
	@Length(3, 15)
	@Expose()
	username: string;
}