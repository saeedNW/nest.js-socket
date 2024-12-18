import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
	TMulterFile,
	uploadFinalization,
} from "src/common/utils/multer.utility";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
	constructor(
		/** Register mongoose user model */
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,

		/** make the current request accessible in service  */
		@Inject(REQUEST)
		private request: Request
	) {}

	/**
	 * Update user's username
	 * @param {string} username - user's chosen username
	 */
	async username(username: string) {
		/** Retrieve user's id from request */
		const { id: userId } = this.request.user;

		/** check for duplicated username */
		const duplicatedUsername = await this.userModel.findOne({
			username,
			_id: { $ne: userId },
		});

		/** Throw error if username was duplicated */
		if (duplicatedUsername) {
			throw new BadRequestException("Duplicated username");
		}

		/** Update username */
		await this.userModel.updateOne({ _id: userId }, { username });

		return "Username updated";
	}

	/**
	 * Retrieve user's data
	 */
	retrieveUser() {
		/** Retrieve user from request */
		const user = this.request.user;

		return {
			id: user._id,
			phone: user.phone,
			username: user.username,
		};
	}

	/**
	 * Retrieve all users' data
	 */
	async findAll() {
		/** Extract user id from request */
		const userId = this.request.user.id;

		const users = await this.userModel.find(
			{ _id: { $ne: userId } },
			{ phone: 1, username: 1, _id: 1, profileImage: 1 }
		);

		return { users };
	}

	/**
	 * Update user's profile image
	 * @param {TMulterFile} image - User's chosen profile image
	 */
	async profileImage(image: TMulterFile) {
		/** Extract user id from request */
		const userId = this.request.user.id;

		/** finalize upload process */
		const location = await uploadFinalization(image, "/profile-image");

		/** Update user's data */
		await this.userModel.updateOne({ _id: userId }, { profileImage: location });

		return "Profile image updates successfully";
	}
}
