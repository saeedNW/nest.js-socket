import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString, Length } from "class-validator";

/**
 * User authentication process DTO
 */
export class SendOtpDto {
	@IsString()
	@IsPhoneNumber("IR", { message: "Invalid phone number" })
	@Expose()
	phone: string;
}

/**
 * Client Check OTP process validator
 */
export class CheckOtpDto {
	@IsString()
	@Length(5, 5, { message: "Invalid OTP code" })
	@Expose()
	code: string;
}
