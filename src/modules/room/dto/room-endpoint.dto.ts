import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class RoomEndpointDto {
	@IsUUID()
	@Expose()
	endpoint: string;
}
