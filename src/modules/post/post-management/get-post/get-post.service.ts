import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import {
	Post_GetPostResponseDTO
} from 'shared/dto/post/get-post.dto';

@Injectable()
export class GetPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(id: string): Promise<Post_GetPostResponseDTO> {
		const foundPost: Post = await this.postModel.findById(id);
		return {
			title: foundPost.title,
			content: foundPost.content,
			media: foundPost.media
		}
	}
}
