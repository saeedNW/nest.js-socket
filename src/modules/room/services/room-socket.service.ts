import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument } from "../schema/room.schema";
import { Model } from "mongoose";
import { Socket, Server } from "socket.io";
import { WsException } from "@nestjs/websockets";
import {
	Message,
	MessageDocument,
} from "src/modules/message/schema/message.schema";

@Injectable()
export class RoomSocketService {
	constructor(
		/** Register mongoose room model */
		@InjectModel(Room.name)
		private roomModel: Model<RoomDocument>,

		/** Register mongoose message model */
		@InjectModel(Message.name)
		private messageModel: Model<MessageDocument>
	) {}

	/**
	 * Fetches rooms for a specific user and notifies
	 * online sockets with updated room data.
	 *
	 * @param {string} event - The name of the event to emit.
	 * @param {Socket} client - The socket instance of the requesting user.
	 * @param {Map<string, string>} usersMap - A map of socket IDs to user IDs.
	 * @param {Server} server - The Socket.IO server instance.
	 * @returns {Promise<{ event: string; data: { rooms: Room[] } }>} - The event name and rooms data.
	 */
	async getRooms(
		event: string,
		client: Socket,
		usersMap: Map<string, string>,
		server: Server
	): Promise<{ event: string; data: { rooms: Room[] } }> {
		/** Extract user's ID from the client */
		const { id: userId } = client.data.user;

		/** Fetch rooms for the requesting user */
		const userRooms = await this.fetchUserRooms(userId);

		/** Notify all online sockets (excluding the current user) */
		const onlineSockets = this.getOnlineSockets(usersMap, userId);

		for (const socketData of onlineSockets) {
			/** Fetch rooms for the current online user */
			const otherUserRooms = await this.fetchUserRooms(socketData.onlineUserId);

			/** Emit the rooms data to the respective socket */
			server.to(socketData.socketId).emit(event, { rooms: otherUserRooms });
		}

		/** Return the requesting user's rooms data */
		return { event, data: { rooms: userRooms } };
	}

	/**
	 * Fetches the list of rooms for a given user ID.
	 *
	 * @private
	 * @param {string} userId - The ID of the user.
	 * @returns {Promise<Room[]>} - A promise resolving to the list of rooms.
	 */
	private async fetchUserRooms(userId: string): Promise<Room[]> {
		return this.roomModel
			.find({ users: userId }) // Fetch rooms where the user is a member
			.sort({ createdAt: -1 }) // Sort by the most recently created rooms
			.populate({
				path: "users", // Populate the 'users' field
				select: "-otp -__v", // Exclude sensitive fields
			})
			.exec(); // Execute the query
	}

	/**
	 * Filters online sockets to exclude the current user and formats the data.
	 *
	 * @private
	 * @param {Map<string, string>} usersMap - A map of socket IDs to user IDs.
	 * @param {string} excludeUserId - The user ID to exclude (typically the requesting user).
	 * @returns {{ socketId: string; onlineUserId: string }[]} - An array of online sockets.
	 */
	private getOnlineSockets(
		usersMap: Map<string, string>,
		excludeUserId: string
	): { socketId: string; onlineUserId: string }[] {
		return [...usersMap.entries()]
			.filter(([_, onlineUserId]) => onlineUserId !== excludeUserId) // Exclude the requesting user
			.map(([socketId, onlineUserId]) => ({ socketId, onlineUserId })); // Map to an array of socket data
	}

	/**
	 * Allows a user to join a specific room, retrieves past messages, and ensures room existence.
	 *
	 * @param {string} event - The name of the event to emit.
	 * @param {Socket} client - The socket instance of the requesting user.
	 * @param {string} endpoint - The room identifier (room name or ID).
	 * @returns {Promise<{ event: string; data: { messages: Message[] } }>} - The event and retrieved messages.
	 */
	async joinRoom(
		event: string,
		client: Socket,
		endpoint: string
	): Promise<{ event: string; data: { messages: Message[] } }> {
		/** Extract user's ID from the client */
		const { id: userId } = client.data.user;

		/** Ensure the room exists for the given user and endpoint */
		await this.ensureRoomExists(userId, endpoint);

		/** Leave all existing rooms before joining a new one */
		this.leaveAllRooms(client);

		/** Join the specified room */
		client.join(endpoint);

		/** Retrieve and return messages for the room */
		const messages = await this.fetchRoomMessages(endpoint);

		return { event, data: { messages } };
	}

	/**
	 * Ensures that a room exists for a user and the specified endpoint.
	 *
	 * @private
	 * @param {string} userId - The ID of the user.
	 * @param {string} endpoint - The room identifier (room name or ID).
	 * @returns {Promise<RoomDocument>} - Return room's data
	 */
	private async ensureRoomExists(
		userId: string,
		endpoint: string
	): Promise<RoomDocument> {
		/** Check if there is any room for given endpoint where the user is part of */
		const room = await this.roomModel.findOne({ endpoint, users: userId });

		/** Throw error if room was not found */
		if (!room) {
			throw new WsException({
				message: "Room does not exists",
				statusCode: 404,
			});
		}

		return room;
	}

	/**
	 * Makes the client leave all currently joined rooms.
	 *
	 * @private
	 * @param {Socket} client - The socket instance of the user.
	 */
	private leaveAllRooms(client: Socket): void {
		/** Extract client's connected rooms name */
		const rooms = client.rooms;

		/** Leave all rooms except the default (client.id) */
		for (const room of rooms) {
			if (room !== client.id) {
				client.leave(room);
			}
		}
	}

	/**
	 * Fetches messages for a specific room, sorted by timestamp.
	 *
	 * @private
	 * @param {string} endpoint - The room identifier (room name or ID).
	 * @returns {Promise<Message[]>} - A promise resolving to the list of messages.
	 */
	private async fetchRoomMessages(endpoint: string): Promise<Message[]> {
		return await this.messageModel
			.find({ endpoint })
			.populate({
				path: "sender",
				select: "-otp -__v",
			});
	}
}
