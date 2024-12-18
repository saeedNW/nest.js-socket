import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/otp.dto";
import { Response } from "express";
import { plainToClass } from "class-transformer";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * create and send OTP code to user's phone number
	 * @param res - client current request's response
	 * @param sendOtpDto - client data need to generate and send OTP code
	 */
	@Post("/send-otp")
	sendOtp(
		@Res({ passthrough: true }) res: Response,
		@Body() sendOtpDto: SendOtpDto
	) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(SendOtpDto, sendOtpDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.sendOtp(filteredData, res);
	}

	/**
	 * Validating client's OTP code
	 * @param checkOtpDto - Client OTP code
	 */
	@Post("/check-otp")
	checkOtp(@Body() checkOtpDto: CheckOtpDto) {
		/** filter client data and remove unwanted data */
		const { code } = plainToClass(CheckOtpDto, checkOtpDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.checkOtp(code);
	}
}
