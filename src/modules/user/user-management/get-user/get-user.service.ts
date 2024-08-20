import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	User_GetUserRequestParamDTO,
	User_GetUserResponseDTO
} from 'shared/dto/user/get-user.dto';

@Injectable()
export class GetUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(paramDTO: User_GetUserRequestParamDTO): Promise<User_GetUserResponseDTO> {
		const { userId } = paramDTO;
		const foundUser = await this.userModel.findById(userId);
		if (foundUser) {
			throw new BadRequestException('Email existed!');
		}
		return {
			userId: foundUser.id,
			email: foundUser.email,
			username: foundUser.username,
			avatar: foundUser.avatar
		}
	}
}
