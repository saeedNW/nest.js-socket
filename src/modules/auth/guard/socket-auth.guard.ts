import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { isJWT } from "class-validator";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketAuthService } from "../services/socket-auth.service";

/**
 * Guard to protect WebSocket events by validating access tokens.
 *
 * The `WsAuthGuard` class implements the `CanActivate` interface to control access
 * to WebSocket events based on user authentication. It retrieves and verifies an access
 * token from the `Authorization` header in the WebSocket handshake.
 *
 * @class
 * @implements {CanActivate} In NestJS all guards and custom guards must be implemented from CanActivate
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
	constructor(
		/** Register auth service */
		private authService: SocketAuthService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> | never {
		/** convert context to WebSocket */
		const wsContext = context.switchToWs();
		/** retrieve socket object */
		const socket: Socket = wsContext.getClient<Socket>();
		/** retrieve token from client's handshake headers */
		const token: string = this.extractToken(socket);

		/** validate token and retrieve user data */
		socket.data.user = await this.authService.socketValidateAccessToken(token);

		return true;
	}

	/**
	 * Extracts the access token from the `Authorization` header
	 * @param {Socket} socket - The WebSocket client object
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {string} The extracted JWT token
	 */
	protected extractToken(socket: Socket): string {
		/** retrieve authorization header from handshake headers */
		const { authorization } = socket?.handshake?.auth;

		/** throw an error if authorization header was not set or if it was empty */
		if (!authorization || authorization?.trim() == "") {
			throw new WsException({
				message: "Authorization failed, please retry",
				statusCode: 401,
			});
		}

		/** separate token from bearer keyword */
		const [bearer, token] = authorization?.split(" ");

		/** throw error if the bearer keyword or the token are invalid */
		if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
			throw new WsException({
				message: "Authorization failed, please retry",
				statusCode: 401,
			});
		}

		/** return the access token */
		return token;
	}
}
