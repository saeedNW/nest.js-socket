import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./services/message.service";
import { AuthModule } from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./schema/message.schema";
import { MessageSocketService } from "./services/message-socket.service";
import { MessageGateway } from "./message.gateway";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
	],
	controllers: [MessageController],
	providers: [MessageService, MessageGateway, MessageSocketService],
})
export class MessageModule {}
