import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RoomService } from "./services/room.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { AuthGuard } from "../auth/guard/auth.guard";
import { plainToClass } from "class-transformer";

@Controller("room")
@UseGuards(AuthGuard)
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

  /**
   * Create new chat room
   * @param createRoomDto - Room data
   */
	@Post()
	create(@Body() createRoomDto: CreateRoomDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreateRoomDto, createRoomDto, {
			excludeExtraneousValues: true,
		});

		return this.roomService.create(filteredData);
  }
  
  /**
   * retrieve all the rooms that the user is part of
   */
  @Get("/all")
  findAll() {
		return this.roomService.findAll();
  }
}
