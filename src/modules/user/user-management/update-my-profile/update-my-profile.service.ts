import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	User_UpdateMyProfileRequestBodyDTO,
	User_UpdateMyProfileResponseDTO
} from 'shared/dto/user/update-my-profile.dto';

@Injectable()
export class UpdateMyProfileService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(
		bodyDTO: User_UpdateMyProfileRequestBodyDTO,
		authUser: AuthUserPayload
	): Promise<User_UpdateMyProfileResponseDTO> {
		const { username, website, avatar, bio, cover, birthday, gender, location } = bodyDTO;
		const { userId } = authUser;

		const updatedResult = await this.userModel.findByIdAndUpdate(
			userId,
			{
				username,
				avatar,
				profile: {
					website,
					bio,
					cover,
					birthday,
					gender,
					location
				}
			}
		)
		console.log(updatedResult);
		return {
			status: true
		};
	}
}
