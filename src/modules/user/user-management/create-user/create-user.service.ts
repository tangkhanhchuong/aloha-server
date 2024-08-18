import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	User_CreateUserRequestBodyDTO,
	User_CreateUserResponseDTO
} from 'shared/dto/user/create-user.dto';

@Injectable()
export class CreateUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(dto: User_CreateUserRequestBodyDTO): Promise<User_CreateUserResponseDTO> {
		const { email, username } = dto;
		const foundUser = await this.userModel.findOne({ email });
		if (foundUser) {
			throw new BadRequestException('Email existed!');
		}
		const user = await this.userModel.create({
			email,
			username,
		});
		const savedUser: User = await user.save();

		return {
			id: savedUser.id
		}
	}
}
