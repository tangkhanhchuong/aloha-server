import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { PostReaction } from 'database/post/post-reaction.dto';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Post_ReactToPostRequestBodyDTO,
	Post_ReactToPostRequestParamDTO,
	Post_ReactToPostResponseDTO,
} from 'shared/dto/post/react-to-post.dto';

@Injectable()
export class ReactToPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		@InjectModel(PostReaction.name)
		private readonly postReactionModel: Model<PostReaction>,
    ) {}
    
	async execute(
		bodyDTO: Post_ReactToPostRequestBodyDTO,
		paramDTO: Post_ReactToPostRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Post_ReactToPostResponseDTO> {
		const { reaction } = bodyDTO;
		const { postId } = paramDTO;
		const { userId } = authUser;

		const post = await this.postModel.findById(postId).exec();
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		let postReaction = await this.postReactionModel.findOne({
			postId,
			createdBy: userId
		});
		if (!postReaction) {
			if (!bodyDTO.reaction) {
				return {
					isReacted: false
				};
			}
			postReaction = new this.postReactionModel({
				postId,
				reactionType: reaction,
				createdBy: userId
			});
			post.numberOfReactions += 1;
		} else {
			if (bodyDTO.reaction && postReaction.reactionType === bodyDTO.reaction) {
				return {
					isReacted: false
				};
			}
			if (bodyDTO.reaction && !postReaction.reactionType) {
				post.numberOfReactions += 1;
			} else if (!bodyDTO.reaction && postReaction.reactionType) {
				post.numberOfReactions -= 1;
			}
			postReaction.reactionType = bodyDTO.reaction;
		}
		await postReaction.save();
		await post.save();

		return {
			isReacted: !!postReaction.reactionType
		};
	}
}
