import {
	Body,
	Controller,
	Get,
	Patch,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "../auth/guard/auth.guard";
import { UserService } from "./user.service";
import { UpdateUsernameDto } from "./dto/username.dto";
import { plainToClass } from "class-transformer";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	multerImageUploader,
	TMulterFile,
} from "src/common/utils/multer.utility";
import { FileUploader } from "src/common/decorators/file-uploader.decorator";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 * Update user's username
	 * @param {UpdateUsernameDto} updateUsernameDto - user's chosen username
	 */
	@Patch("/username")
	username(@Body() updateUsernameDto: UpdateUsernameDto) {
		/** filter client data and remove unwanted data */
		const { username } = plainToClass(UpdateUsernameDto, updateUsernameDto, {
			excludeExtraneousValues: true,
		});

		return this.userService.username(username);
	}

	/**
	 * Retrieve user's data
	 */
	@Get("")
	retrieveUser() {
		return this.userService.retrieveUser();
	}

	/**
	 * Retrieve all users' data
	 */
	@Get("/all")
	findAll() {
		return this.userService.findAll();
	}

	/**
	 * Update user's profile image
	 * @param {TMulterFile} image - User's chosen profile image
	 */
	@Patch("/profile-image")
	@UseInterceptors(FileInterceptor("image", multerImageUploader()))
	profileImage(@FileUploader() image: TMulterFile) {
		return this.userService.profileImage(image);
	}
}
