import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { MediaMineTypes } from 'shared/business/file/file';
import {
	Auth_GetMeResponseDTO
} from 'shared/dto/auth/get-me.dto';
import { GenerateSignedUrlsService } from 'src/modules/media/generate-signed-urls/generate-signed-urls.service';

@Injectable()
export class GetMeService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly generateSignedUrlsService: GenerateSignedUrlsService
	) {}

	async execute(authUser: AuthUserPayload): Promise<Auth_GetMeResponseDTO> {
		const { userId } = authUser;
		const foundUser = await this.userModel.findById(userId);
		if (!foundUser) {
			throw new BadRequestException('User not found');
		}

		const userResponse = {
			userId: foundUser.id,
			email: foundUser.email,
			username: foundUser.username,
			slug: foundUser.slug
		};
		if (foundUser.avatar) {
			const signedResponse = await this.generateSignedUrlsService.generateDownloadSignedUrl(
				{
					fileNames: [foundUser.avatar],
					mineType: MediaMineTypes.IMAGES_PNG
				}
			);
			userResponse['avatar'] = signedResponse.files[0]?.url;
		}

		return userResponse;
	}
}
