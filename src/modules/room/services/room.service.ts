import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { CreateRoomDto } from "../dto/create-room.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument } from "../schema/room.schema";
import { Model } from "mongoose";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { RoomType } from "../enum/room-type.enum";

@Injectable({ scope: Scope.REQUEST })
export class RoomService {
	constructor(
		/** Register mongoose user model */
		@InjectModel(Room.name)
		private roomModel: Model<RoomDocument>,

		/** make the current request accessible in service  */
		@Inject(REQUEST)
		private request: Request
	) {}

	/**
	 * Create new chat room
	 * @param createRoomDto - Room data
	 */
	async create(createRoomDto: CreateRoomDto) {
		/** Retrieve user's id from request */
		const { id: userId } = this.request.user;

		/** Destructure rooms properties */
		let { name, type, users } = createRoomDto;

		if (users.length > 1 && type === RoomType.PRIVATE) {
			type = RoomType.GROUP;
		}

		if (type === RoomType.GROUP && !name) {
			throw new BadRequestException("group name is required");
		}

		/** Add the current user's id to users list */
		users.push(userId.toString());

		/** Create new instance from room model with given data */
		let newRoom = new this.roomModel({ type, users });

		/** Add room name to room data if provided */
		if (name) {
			newRoom.name = name;
		}

		/** Save  room data in database */
		newRoom = await newRoom.save();

		return { newRoom };
	}

	/**
	 * retrieve all the rooms that the user is part of
	 */
	async findAll() {
		/** Retrieve user's id from request */
		const { id: userId } = this.request.user;

		/** Retrieve rooms data */
		const rooms = await this.roomModel
			.find({ users: userId })
			.sort({ createdAt: -1 })
			.populate({
				path: "users",
				select: "-otp -__v",
			});

		return { rooms };
	}
}
