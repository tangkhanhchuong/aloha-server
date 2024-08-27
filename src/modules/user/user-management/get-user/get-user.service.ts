import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as moment from 'moment';

import { User } from 'database/user/user';
import {
	Auth_GetUserRequestParamDTO,
	Auth_GetUserResponseDTO
} from 'shared/dto/user/get-user.dto';
import { GenerateSignedUrlsService } from 'src/modules/media/generate-signed-urls/generate-signed-urls.service';
import { MediaMineTypes } from 'core/aws/s3/s3.utils';

@Injectable()
export class GetUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly generateSignedUrlsService: GenerateSignedUrlsService
	) {}

	async execute(paramDTO: Auth_GetUserRequestParamDTO): Promise<Auth_GetUserResponseDTO> {
		const { userId } = paramDTO;
		if (!isValidObjectId(userId)) {
			throw new BadRequestException('Invalid userId');
		}
		const foundUser = await this.userModel.findById(userId);
		if (!foundUser) {
			throw new BadRequestException('User not found');
		}

		const userProfile = foundUser.profile;
		const response = {
			userId: foundUser.id,
			mobile: foundUser.mobile,
			username: foundUser?.username,
			bio: userProfile?.bio,
			fullname: userProfile?.fullname,
			birthday: userProfile?.birthday ? moment(userProfile?.birthday).format('MMM D, YYYY') : null,
			gender: userProfile?.gender?.toString() || null,
			website: userProfile?.website,
			location: userProfile?.location,
			joinedAt: foundUser?.createdAt ? moment(foundUser?.createdAt).format('MMM D, YYYY') : null,
			numberOfFollowers: foundUser.numberOfFollowers,
			numberOfFollowees: foundUser.numberOfFollowees,
			numberOfPosts: foundUser.numberOfPosts,
			avatar: null,
			cover: null
		};

		if (foundUser.avatar) {
			const signedResponse = await this.generateSignedUrlsService.generateDownloadSignedUrl(
				{
					fileKeys: [foundUser.avatar],
					mineType: MediaMineTypes.IMAGES_PNG
				}
			);
			response['avatar'] = signedResponse.urls[0];
		}

		if (userProfile.cover) {
			const signedResponse = await this.generateSignedUrlsService.generateDownloadSignedUrl(
				{
					fileKeys: [userProfile.cover],
					mineType: MediaMineTypes.IMAGES_PNG
				}
			);
			response['cover'] = signedResponse.urls[0];
		}
		
		return response;
	}
}
