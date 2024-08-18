import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { PostStatuses } from 'shared/constants/post';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Feed_GetHomeTimelineRequestQueryDTO,
	Feed_GetHomeTimelineResponseDTO
} from 'shared/dto/feed/get-home-timeline.dto';
import { PostMapper } from 'shared/mappers/post.mapper';

@Injectable()
export class GetHomeTimelineService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly postMapper: PostMapper,
    ) {}
    
	async execute(
		queryDTO: Feed_GetHomeTimelineRequestQueryDTO,
		authUser: AuthUserPayload
	): Promise<Feed_GetHomeTimelineResponseDTO> {
		const { limit, page } = queryDTO;

		const filter: FilterQuery<Post> = {
			status: PostStatuses.PUBLISHED,
			deletedAt: { $ne: null }
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
		return new Feed_GetHomeTimelineResponseDTO(
			postDTOs,
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
