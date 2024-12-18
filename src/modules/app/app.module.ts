import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { resolve } from "path";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { RoomModule } from "../room/room.module";
import { MessageModule } from "../message/message.module";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve(".env"),
			isGlobal: true,
		}),

		/** Register MongoDB connection */
		MongooseModule.forRoot("mongodb://localhost:27017/nestjs-chat"),

		/** Register modules */
		AuthModule,
		UserModule,
		RoomModule,
		MessageModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
