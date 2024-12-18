import { Module } from "@nestjs/common";
import { RoomService } from "./services/room.service";
import { RoomController } from "./room.controller";
import { AuthModule } from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "./schema/room.schema";
import { RoomGateway } from "./room.gateway";
import { RoomSocketService } from "./services/room-socket.service";
import { Message, MessageSchema } from "../message/schema/message.schema";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([
			{ name: Room.name, schema: RoomSchema },
			{ name: Message.name, schema: MessageSchema },
		]),
	],
	controllers: [RoomController],
	providers: [RoomService, RoomGateway, RoomSocketService],
})
export class RoomModule {}
