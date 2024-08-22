import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
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
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(
		bodyDTO: Post_CreatePostRequestBodyDTO,
		authUser: AuthUserPayload
	): Promise<Post_CreatePostResponseDTO> {
		const { title, content, media } = bodyDTO;

		const createdPost = await this.postModel.create({
			title,
			content,
			media,
			createdBy: authUser.userId 
		});
		const savedPost = await createdPost.save();

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
