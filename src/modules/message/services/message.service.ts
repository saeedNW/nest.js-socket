import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "../schema/message.schema";
import { Model } from "mongoose";
import {
	TMulterFile,
	uploadFinalization,
} from "src/common/utils/multer.utility";

@Injectable()
export class MessageService {
	constructor(
		/** Register mongoose user model */
		@InjectModel(Message.name)
		private roomModel: Model<MessageDocument>
	) {}

	/**
	 * message image uploader
	 * @param {TMulterFile} image - User's chosen profile image
	 */
	async imageUploader(image: TMulterFile) {
		/** finalize upload process */
		const location = await uploadFinalization(image, "/message");

		const imageURL = `http://localhost:3000${location}`;

		return { imageURL };
	}
}
