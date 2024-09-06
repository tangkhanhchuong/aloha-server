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
		console.log({ bodyDTO })
		const {
			website,
			avatar,
			bio,
			fullname,
			cover,
			birthday,
			gender,
			location
		} = bodyDTO;
		const { userId } = authUser;

		await this.userModel.findByIdAndUpdate(
			userId,
			{
				$set: {
					avatar,
					'profile.website': website,
					'profile.bio': bio,
                    'profile.fullname': fullname,
                    'profile.cover': cover,
                    'profile.birthday': birthday,
                    'profile.gender': gender,
                    'profile.location': location,	
				}
			}
		)
		return {
			status: true
		};
	}
}
