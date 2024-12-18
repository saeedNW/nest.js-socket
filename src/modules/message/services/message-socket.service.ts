import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "../schema/message.schema";
import { Model } from "mongoose";
import { Server, Socket } from "socket.io";
import { isLink } from "src/common/utils/functions.utility";
import { MessageType } from "../enum/message-type.enum";

@Injectable()
export class MessageSocketService {
	constructor(
		/** Register mongoose message model */
		@InjectModel(Message.name)
		private messageModel: Model<MessageDocument>
	) {}

	/**
	 * Save new message in database and resend it to irs related room
	 * @param {Server} server - The Socket.IO server instance.
	 * @param {Socket} client - The socket instance of the requesting user.
	 * @param {string} content - message's content
	 */
	async newMessage(server: Server, client: Socket, content: string) {
		/** Extract user's data from the client */
		const sender = client.data.user;

		/** Extract client's current room from rooms list */
		const endpoint = [...client.rooms].find((value) => value !== client.id);

		/** Determine the type of the message content */
		const type = isLink(content) ? MessageType.FILE : MessageType.TEXT;

		/** Save the new message in database */
		const newMessage = await this.messageModel.create({
			endpoint,
			sender: sender._id,
			content,
			type,
		});

		/** Create the message object with sender details */
		const message = {
			...newMessage.toObject(),
			sender,
		};

		/** Send message to its related room */
		return server.to(endpoint).emit("receive-message", { message });
	}
}
