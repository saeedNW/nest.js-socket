import { Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "../auth/guard/auth.guard";
import { MessageService } from "./services/message.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	multerImageUploader,
	TMulterFile,
} from "src/common/utils/multer.utility";
import { FileUploader } from "src/common/decorators/file-uploader.decorator";

@Controller("message")
@UseGuards(AuthGuard)
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	/**
	 * message image uploader
	 * @param {TMulterFile} image - User's chosen profile image
	 */
	@Post("/image-uploader")
	@UseInterceptors(FileInterceptor("image", multerImageUploader()))
	imageUploader(@FileUploader() image: TMulterFile) {
		return this.messageService.imageUploader(image);
	}
}
