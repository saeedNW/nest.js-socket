import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../user/schema/user.schema";
import { Model } from "mongoose";
import { TokenService } from "./token.service";
import { WsException } from "@nestjs/websockets";

/**
 * ? To ensure NestJS handles dependency injection correctly for WebSockets,
 * ? avoid using the `scope` option in the `@Injectable` decorator for services
 * ? that are directly used in the gateway file.
 */
@Injectable()
export class SocketAuthService {
	constructor(
		/** Register mongoose user model */
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,

		/** Register token service */
		private readonly tokenService: TokenService
	) {}

	/**
	 * Clients' socket access token validation process
	 * @param {string} token - Access token retrieved from client's request
	 * @returns {Promise<UserDocument | never>} - Returns user's data or throw an error
	 */
	async socketValidateAccessToken(
		token: string
	): Promise<UserDocument | never> {
		/** extract user's id from access token */
		const { userId } = this.tokenService.verifyAccessToken(token);

		/** retrieve user's data from database */
		const user = await this.userModel.findById(userId);

		/** throw error if user was not found */
		if (!user) {
			throw new WsException({
				message: "Authorization failed, please retry",
				statusCode: 401,
			});
		}

		/** return user's data */
		return user;
	}
}
