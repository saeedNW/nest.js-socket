import { UseGuards } from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { WsAuthGuard } from "../auth/guard/socket-auth.guard";
import { WsGeneralDecorators } from "src/common/decorators/ws-general.decorator";
import { MessageSocketService } from "./services/message-socket.service";
import { Server, Socket } from "socket.io";
import { MessageDto } from "./dto/message.dto";
import { plainToClass } from "class-transformer";

@WebSocketGateway({ cors: { origin: "*" } })
@UseGuards(WsAuthGuard)
@WsGeneralDecorators()
export class MessageGateway implements OnGatewayInit {
	constructor(private readonly messageSocketService: MessageSocketService) {}

	/** Socket.IO Server instance */
	@WebSocketServer() server: Server;

	/**
	 * Called after the gateway is initialized.
	 * @param {Server} server - The Socket.IO server instance.
	 */
	afterInit(server: any) {
		console.log("Message Socket Initialized");
	}

	/**
	 * Save new message in database and resend it to irs related room
	 * @param {Socket} client - The socket instance of the requesting user.
	 * @param {MessageDto} messageDto - message data sent by client
	 */
	@SubscribeMessage("send-message")
	handleMessage(
		@MessageBody() messageDto: MessageDto,
		@ConnectedSocket() client: Socket
	) {
		/** filter client data and remove unwanted data */
		const { content } = plainToClass(MessageDto, messageDto, {
			excludeExtraneousValues: true,
		});

		return this.messageSocketService.newMessage(this.server, client, content);
	}
}
