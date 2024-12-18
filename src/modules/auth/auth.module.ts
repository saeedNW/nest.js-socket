import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/schema/user.schema";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./services/token.service";
import { SocketAuthService } from "./services/socket-auth.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		SocketAuthService,
		JwtService,
		TokenService,
	],
	exports: [
		AuthService,
		SocketAuthService,
		MongooseModule,
		JwtService,
		TokenService,
	],
})
export class AuthModule {}
