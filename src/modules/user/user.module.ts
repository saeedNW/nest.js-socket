import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
