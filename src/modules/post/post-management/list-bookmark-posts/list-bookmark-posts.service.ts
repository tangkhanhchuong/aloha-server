import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Post } from 'database/post/post';
import { PostReaction } from 'database/post/post-reaction.dto';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { PostStatuses } from 'shared/business/post/post';
import {
	Post_ListBookmarkPostsRequestParamDTO,
	Post_ListBookmarkPostsRequestQueryDTO,
	Post_ListBookmarkPostsResponseDTO
} from 'shared/dto/post/list-bookmark-posts.dto';
import { PostMapper } from 'shared/mappers/post.mapper';

@Injectable()
export class ListBookmarkPostsService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(PostReaction.name)
		private readonly postReactionModel: Model<PostReaction>,
		private readonly postMapper: PostMapper,
    ) {}
    
	async execute(
        queryDTO: Post_ListBookmarkPostsRequestQueryDTO,
        paramDTO: Post_ListBookmarkPostsRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Post_ListBookmarkPostsResponseDTO> {
        const { limit, page } = queryDTO;
		const { userId: authorId } = paramDTO;
		const { userId } = authUser;

		const author = await this.userModel.exists({
			_id: authorId
		});
		if (!author) {
			throw new NotFoundException('User not found');
		}

		const filter: FilterQuery<Post> = {
			status: PostStatuses.PUBLISHED,
			createdBy: authorId,
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
			const postReaction = await this.postReactionModel.exists({
				post: postEntity._id.toString(),
				reactionType: { $ne: null },
            	createdBy: userId,
			});
			return this.postMapper.entityToDTO(
				{
					...postEntity['_doc'],
					isReacted: !!postReaction,
				} as Post & { createdBy: User, isReacted: boolean },
			);
		}));
		
		return new Post_ListBookmarkPostsResponseDTO(
			postDTOs,
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
