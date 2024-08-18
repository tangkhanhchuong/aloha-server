import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { PostStatuses } from 'shared/constants/post';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
    Feed_GetUserTimelineRequestQueryDTO,
    Feed_GetUserTimelineRequestParamDTO,
    Feed_Feed_GetUserTimelineResponseDTO
} from 'shared/dto/feed/get-user-timeline.dto';
import { PostMapper } from 'shared/mappers/post.mapper';

@Injectable()
export class GetUserTimelineService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly postMapper: PostMapper,
    ) {}
    
	async execute(
        queryDTO: Feed_GetUserTimelineRequestQueryDTO,
        paramDTO: Feed_GetUserTimelineRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Feed_Feed_GetUserTimelineResponseDTO> {
        const { limit, page } = queryDTO;
        const { userId } = paramDTO;

		const filter: FilterQuery<Post> = {
			status: PostStatuses.PUBLISHED,
			createdBy: userId,
			deletedAt: null
		};
		const [postEntities, count] = await Promise.all([
			this.postModel
				.find(filter)
				.populate('createdBy')
				.skip(limit * (+page - 1))
				.limit(limit)
				.sort({ createdAt: -1 })
				.exec(),
			this.postModel.countDocuments(filter)
		]);
		
		const postDTOs = await Promise.all(postEntities.map(async (postEntity) => {
			return this.postMapper.entityToDTO(postEntity as Post & { createdBy: User });
		}));
		
		return new Feed_Feed_GetUserTimelineResponseDTO(
			postDTOs,
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
