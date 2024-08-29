import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Types } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	Post_BookmarkPostRequestParamDTO,
	Post_BookmarkPostResponseDTO
} from 'shared/dto/post/bookmark-post.dto';

@Injectable()
export class BookmarkPostService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(
		paramDTO: Post_BookmarkPostRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Post_BookmarkPostResponseDTO> {
		const { postId } = paramDTO;
		const { userId } = authUser;

		console.log({ postId, userId })
		const post = await this.postModel.findById(postId);
		if (!post) {
            throw new NotFoundException('Post not found');
		}
		
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const postIncludedInBookmarkds = user.bookmarks.map(postId => postId.toString()).includes(postId);
		if (postIncludedInBookmarkds) {
			user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
		} else {
			user.bookmarks.push(new Types.ObjectId(postId));
		}
		await user.save();

		return {
			status: true
		}
	}
}
