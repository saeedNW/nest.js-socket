import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { RoomSocketService } from "./services/room-socket.service";
import { Server, Socket } from "socket.io";
import { WsAuthGuard } from "../auth/guard/socket-auth.guard";
import { UseGuards } from "@nestjs/common";
import { RoomEndpointDto } from "./dto/room-endpoint.dto";
import { WsGeneralDecorators } from "src/common/decorators/ws-general.decorator";
import { plainToClass } from "class-transformer";

@WebSocketGateway({ cors: { origin: "*" } })
@UseGuards(WsAuthGuard)
@WsGeneralDecorators()
export class RoomGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly roomSocketService: RoomSocketService) {}

	/** Map to track user sockets with their associated user IDs */
	private usersMap: Map<string, string> = new Map();

	/** Socket.IO Server instance */
	@WebSocketServer() server: Server;

	/**
	 * Called after the gateway is initialized.
	 * @param {Server} server - The Socket.IO server instance.
	 */
	afterInit(server: Server): void {
		console.log("Room Socket Initialized");
	}

	/**
	 * Handles a new client connection.
	 * Waits for the user's data to be attached to the socket.
	 * If successful, marks the user as online.
	 *
	 * @param {Socket} client - The connected socket instance.
	 */
	async handleConnection(client: Socket): Promise<void> {
		/** Wait for user data to attach to the socket */
		const user: any = await this.waitForUserData(client);

		if (user) {
			this.usersMap.set(client.id, user._id.toString());

			/** Notify all clients about the user's online status */
			this.server.emit("user-online-status", {
				userId: user._id.toString(),
				isOnline: true,
			});
		} else {
			console.error("User data not attached");
			client.disconnect(true);
		}
	}

	/**
	 * Handles a client disconnection.
	 * Removes the user from the tracking map and notifies others.
	 *
	 * @param {Socket} client - The disconnected socket instance.
	 */
	handleDisconnect(client: Socket): void {
		const userId = this.usersMap.get(client.id);
		if (userId) {
			this.usersMap.delete(client.id);

			/** Notify all clients about the user's offline status */
			this.server.emit("user-online-status", {
				userId: userId.toString(),
				isOnline: false,
			});
		}
	}

	/**
	 * Handles the 'get-rooms' event.
	 * Fetches and returns the list of rooms for the requesting user.
	 *
	 * @param {Socket} client - The socket instance of the user.
	 * @returns {Promise<any>} - The event name and rooms data.
	 */
	@SubscribeMessage("get-rooms")
	async getRooms(client: Socket): Promise<any> {
		/** Simulate a short delay so the userMap object be created */
		await this.waitForShortDelay(60);

		const event = "get-rooms";
		return this.roomSocketService.getRooms(
			event,
			client,
			this.usersMap,
			this.server
		);
	}

	/**
	 * Handles the 'get-online-users' event.
	 * Returns the list of online users to the requesting client.
	 *
	 * @param {Socket} client - The socket instance of the user.
	 * @returns {Promise<{ event: string; data: { onlineUsers: string[] } }>}
	 */
	@SubscribeMessage("get-online-users")
	async getOnlineUsers(
		client: Socket
	): Promise<{ event: string; data: { onlineUsers: string[] } }> {
		/** Simulate a short delay so the userMap object be created */
		await this.waitForShortDelay(60);

		/** Create an array from userMap object values */
		const onlineUsers = Array.from(this.usersMap.values());

		const event = "get-online-users";
		return { event, data: { onlineUsers } };
	}

	/**
	 * Handles the 'joinRoom' event.
	 * Allows a user to join a specific chat room.
	 *
	 * @param {RoomEndpointDto} roomEndpointDto - Data Transfer Object containing the room endpoint.
	 * @param {Socket} client - The socket instance of the user.
	 * @returns {Promise<any>} - The event name and join room data.
	 */
	@SubscribeMessage("joinRoom")
	joinRoom(
		@MessageBody() roomEndpointDto: RoomEndpointDto,
		@ConnectedSocket() client: Socket
	): Promise<any> {
		/** filter client data and remove unwanted data */
		const { endpoint } = plainToClass(RoomEndpointDto, roomEndpointDto, {
			excludeExtraneousValues: true,
		});

		const event = "joinRoom";
		return this.roomSocketService.joinRoom(event, client, endpoint);
	}

	/**
	 * Helper method to wait for user data to attach to the socket.
	 *
	 * @private
	 * @param {Socket} client - The socket instance.
	 * @returns {Promise<any>} - Resolves with the user data.
	 */
	private waitForUserData(client: Socket): Promise<any> {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (client.data?.user) {
					clearInterval(interval);
					resolve(client.data.user);
				}
			}, 50);
		});
	}

	/**
	 * Helper method to simulate a short delay.
	 *
	 * @private
	 * @param {number} ms - The duration of the delay in milliseconds.
	 * @returns {Promise<void>}
	 */
	private waitForShortDelay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
