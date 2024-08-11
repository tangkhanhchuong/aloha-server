import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
    User_CreateUserRequestDTO,
    User_CreateUserResponseDTO
} from 'shared/dto/user/create-user.dto';
import { RequestUserRelationService } from 'shared/request/request-user-relation/request-user-relation.service';

@Injectable()
export class CreateUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly requestUserRelationService: RequestUserRelationService,
	) {}

	async execute(dto: User_CreateUserRequestDTO): Promise<User_CreateUserResponseDTO> {
		const { email, username } = dto;
		const foundUser = await this.userModel.findOne({ email });
		if (foundUser) {
			throw new BadRequestException('Email existed!');
		}
		const user = new this.userModel({
			email,
			username,
		});
		const savedUser: User = await user.save();

		

		return {
			id: savedUser.id
		}
	}
}
