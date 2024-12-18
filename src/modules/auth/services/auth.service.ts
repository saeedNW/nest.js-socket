import {
	BadRequestException,
	Inject,
	Injectable,
	Scope,
	UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request, Response } from "express";
import { TokenService } from "./token.service";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../user/schema/user.schema";
import { Model } from "mongoose";
import { SendOtpDto } from "../dto/otp.dto";
import { randomInt } from "crypto";
import { TAuthResponse } from "../types/response";
import { CookiesName } from "src/common/enums/cookies-name.enum";
import { tokenCookieOptions } from "src/common/utils/cookie.utility";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
	constructor(
		/** Register mongoose user model */
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,

		/** make the current request accessible in service  */
		@Inject(REQUEST)
		private request: Request,

		/** Register token service */
		private readonly tokenService: TokenService,
	) {}

	async sendOtp(sendOtpDto: SendOtpDto, res: Response) {
		/** destructure client data */
		const { phone } = sendOtpDto;

		/** retrieve user's data from database */
		let user: UserDocument = await this.getUser(phone);

		if (!user) {
			/** create new user and save it in database */
			user = await this.userModel.create({ phone });
		}

		/** create OTP data */
		const otp = await this.saveOtp(user);

		/** Generate user's otp token */
		const token = this.tokenService.createOtpToken({
			userId: user._id.toString(),
		});

		/** send response to client */
		return this.sendOtpResponse(res, { token, code: otp.code });
	}

	/**
	 * Retrieve user's data based on the given phone number
	 * @param {string} phone - The input data sent by client
	 */
	async getUser(phone: string) {
		return await this.userModel.findOne({ phone });
	}

	/**
	 * Create new OTP code and save it in database if needed
	 * @param {UserDocument} user - User's data
	 */
	async saveOtp(user: UserDocument) {
		const otp = {
			/** create a random 5 digit number */
			code: randomInt(10000, 99999).toString(),
			/** set the expires time of the OTP for 2 min */
			expires_in: new Date(Date.now() + 1000 * 60 * 2),
		};

		/** check if user already has an otp or not */
		let { otp: userOTP } = user;

		/** throw error if OTP not expired */
		if (userOTP?.expires_in > new Date()) {
			throw new BadRequestException("OTP code is not expire");
		}

		/** save otp data */
		await this.userModel.updateOne({ _id: user._id }, { otp });

		return otp;
	}

	/**
	 * Send authorization process response to client
	 * @param {Response} res - Express response object
	 * @param {TAuthResponse} result - Login/register process result
	 */
	async sendOtpResponse(res: Response, result: TAuthResponse) {
		/** extract data from authentication process result */
		const { token, code } = result;
		/** Set a cookie in user browser ti be used in future auth processes */
		res.cookie(CookiesName.OTP_COOKIE, token, tokenCookieOptions());

		const responseData = {
			message: "OTP code sent successfully",
			code,
			token,
		};

		return responseData;
	}

	/**
	 * OTP code verification
	 * @param code - User's OTP code
	 */
	async checkOtp(code: string) {
		/** Extract client's otp token from current request */
		const token: string | undefined =
			this.request.signedCookies?.[CookiesName.OTP_COOKIE];

		/** throw error if token was undefined */
		if (!token) {
			throw new UnauthorizedException("OTP code is expire");
		}

		/** Verify OTP token and extract user id from it */
		const { userId } = this.tokenService.verifyOtpToken(token);

		/** Retrieve OTP data */
		const { otp, username, _id } =
			await this.userModel.findById(userId);

		/** Throw error if OTP was not found */
		if (!otp) {
			throw new UnauthorizedException("Authorization failed, please retry");
		}

		const now = new Date();

		/** Throw error if OTP was expired */
		if (otp.expires_in < now) {
			throw new UnauthorizedException("OTP code expired");
		}

		/** Throw error if OTP code was invalid */
		if (otp.code !== code) {
			throw new UnauthorizedException("Invalid OTP code");
		}

		/** create client's access token */
		const accessToken = this.tokenService.createAccessToken({ userId });

		return {
			message: "You have logged in successfully",
			id:_id,
			username,
			accessToken,
		};
	}

	/**
	 * Clients' access token validation process
	 * @param {string} token - Access token retrieved from client's request
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {Promise<UserDocument | never>} - Returns user's data or throw an error
	 */
	async validateAccessToken(token: string): Promise<UserDocument | never> {
		/** extract user's id from access token */
		const { userId } = this.tokenService.verifyAccessToken(token);

		/** retrieve user's data from database */
		const user = await this.userModel.findById(userId);

		/** throw error if user was not found */
		if (!user) {
			throw new UnauthorizedException("Authorization failed, please retry");
		}

		/** return user's data */
		return user;
	}
}
