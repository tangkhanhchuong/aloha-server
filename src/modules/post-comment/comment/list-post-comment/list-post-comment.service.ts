import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { PostComment } from 'database/post-comment/post-comment';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	PostComment_ListPostCommentRequestParamDTO,
	PostComment_ListPostCommentRequestQueryDTO,
	PostComment_ListPostCommentResponseDTO
} from 'shared/dto/post-comment/list-post-comment.dto';
import { CommentMapper } from 'shared/mappers/comment.mapper';

@Injectable()
export class ListPostCommentService {
	constructor(
		@InjectModel(PostComment.name)
		private readonly postCommentModel: Model<PostComment>,
		private readonly commentMapper: CommentMapper
	) {}

	async execute(
        paramDTO: PostComment_ListPostCommentRequestParamDTO,
        queryDTO: PostComment_ListPostCommentRequestQueryDTO,
		authUser: AuthUserPayload
	): Promise<PostComment_ListPostCommentResponseDTO> {
		const { userId } = authUser;
        const { limit, page } = queryDTO;
        const { postId } = paramDTO;

		const filter: FilterQuery<PostComment> = {
			createdBy: userId,
			post: postId,
			deletedAt: { $ne: null }
		};
		const [commentEntities, count] = await Promise.all([
			this.postCommentModel.find(filter)
				.populate('createdBy')
				.skip(limit * (+page - 1))
				.limit(limit)
				.exec(),
			this.postCommentModel.countDocuments(filter)
		]);
		const commentDTOs = await Promise.all(commentEntities
			.map((commentEntity) => this.commentMapper.entityToDTO((commentEntity) as PostComment & { createdBy: User })));

		return new PostComment_ListPostCommentResponseDTO(
			commentDTOs,
			page,
			limit,
			count,
		);
	}
}
