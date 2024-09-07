import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { PostStatuses } from 'shared/business/post/post';
import {
    User_GetUserMediaRequestParamDTO,
    User_GetUserMediaRequestQueryDTO,
    User_GetUserMediaResponseDTO
} from 'shared/dto/user/get-user-media.dto';
import { Media } from 'database/media/media';
import { MediaMapper } from 'shared/mappers/media.mapper';

@Injectable()
export class GetUserMediaService {
	constructor(
		@InjectModel(User.name)
        private readonly userModel: Model<User>,
		@InjectModel(Media.name)
		private readonly mediaModel: Model<Media>,
		private readonly mediaMapper: MediaMapper
    ) {}
    
	async execute(
        queryDTO: User_GetUserMediaRequestQueryDTO,
        paramDTO: User_GetUserMediaRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<User_GetUserMediaResponseDTO> {
        const { limit, page } = queryDTO;
		const { userId } = paramDTO;
		const { userId: myId } = authUser;

		if (!isValidObjectId(userId) || !isValidObjectId(myId)) {
			throw new BadRequestException('Invalid user id');
		}

		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const filter: FilterQuery<Post> = {
			status: PostStatuses.PUBLISHED,
			createdBy: userId,
			deletedAt: { $ne: null }
		};
		const [mediaEntities, count] = await Promise.all([
			this.mediaModel
				.find(filter)
				.populate<{ createdBy: User }>('createdBy')
				.skip(limit * (+page - 1))
				.limit(limit)
				.sort({ createdAt: -1 })
				.exec(),
			this.mediaModel.countDocuments(filter)
		]);

		const mediaDTO = await Promise.all(mediaEntities.map((
			file => this.mediaMapper.entityToDTO(file as (Media & { createdBy: User }))
		)));
		return new User_GetUserMediaResponseDTO(
			mediaDTO,
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
