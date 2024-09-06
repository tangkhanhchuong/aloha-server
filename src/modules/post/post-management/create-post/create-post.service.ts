import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { UserMedia } from 'database/user/user-media';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	Post_CreatePostRequestBodyDTO,
	Post_CreatePostResponseDTO,
} from 'shared/dto/post/create-post.dto';

@Injectable()
export class CreatePostService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(UserMedia.name)
		private readonly userMediaModel: Model<UserMedia>,
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}

	async execute(
		bodyDTO: Post_CreatePostRequestBodyDTO,
		authUser: AuthUserPayload
	): Promise<Post_CreatePostResponseDTO> {
		const { content, media } = bodyDTO;

		const createdPost = new this.postModel({
			content,
			files: media,
			createdBy: authUser.userId
		});
		const savedPost = await createdPost.save();

		// Below tasks are async
		for (let file in media) {
			const userMedia = new this.userMediaModel({
                key: file
            });
            await userMedia.save();
		}

		// Below tasks are async
		await this.userModel.findByIdAndUpdate(
			authUser.userId,
			{ $inc: { numberOfPosts: 1 } },
			{ new: true }
		);

		return {
			id: savedPost.id
		}
	}
}
