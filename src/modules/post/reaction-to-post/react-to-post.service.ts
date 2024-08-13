import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Post_ReactToPostRequestBodyDTO,
	Post_ReactToPostRequestParamDTO,
	Post_ReactToPostResponseDTO,
} from 'shared/dto/post/react-to-post.dto';
import { PostReaction } from 'database/post/post-reaction';

@Injectable()
export class ReactToPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		@InjectModel(Post.name)
		private readonly postReaction: Model<PostReaction>,
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
		return {
			postId: "",
			userId: ""
		}
	}
}
