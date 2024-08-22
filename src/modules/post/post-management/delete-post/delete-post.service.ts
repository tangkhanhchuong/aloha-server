import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	Post_DeletePostRequestParamDTO,
	Post_DeletePostResponseDTO
} from 'shared/dto/post/delete-post.dto';

@Injectable()
export class DeletePostService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(
		paramDTO: Post_DeletePostRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Post_DeletePostResponseDTO> {
		const { postId } = paramDTO;
		const deletedPost = await this.postModel.deleteOne({ id: postId });

		await this.userModel.findByIdAndUpdate(
			authUser.userId,
			{ $inc: { numberOfPosts: -1 } },
			{ new: true }
		);
		return { status: deletedPost.acknowledged };
	}
}
