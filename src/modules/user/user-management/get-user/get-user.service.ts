import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import { MediaMineTypes } from 'shared/business/file/file';
import {
	Auth_GetUserRequestParamDTO,
	Auth_GetUserResponseDTO
} from 'shared/dto/user/get-user.dto';
import { GenerateSignedUrlsService } from 'src/modules/media/generate-signed-urls/generate-signed-urls.service';

@Injectable()
export class GetUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly generateSignedUrlsService: GenerateSignedUrlsService
	) {}

	async execute(paramDTO: Auth_GetUserRequestParamDTO): Promise<Auth_GetUserResponseDTO> {
		const { slug } = paramDTO;
		const foundUser = await this.userModel.findOne({ slug });
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
					fileNames: [foundUser.avatar],
					mineType: MediaMineTypes.IMAGES_PNG
				}
			);
			response['avatar'] = signedResponse.files[0]?.url;
		}

		if (userProfile.cover) {
			const signedResponse = await this.generateSignedUrlsService.generateDownloadSignedUrl(
				{
					fileNames: [userProfile.cover],
					mineType: MediaMineTypes.IMAGES_PNG
				}
			);
			response['cover'] = signedResponse.files[0]?.url;
		}
		
		return response;
	}
}
