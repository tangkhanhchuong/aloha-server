import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	Auth_GetMeResponseDTO
} from 'shared/dto/auth/get-me.dto';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';

@Injectable()
export class GetMeService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(authUser: AuthUserPayload): Promise<Auth_GetMeResponseDTO> {
		const { userId } = authUser;
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
