import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import {
    Post_CreatePostRequestDTO,
    Post_CreatePostResponseDTO,
} from 'shared/dto/post/create-post.dto';

@Injectable()
export class CreatePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(dto: Post_CreatePostRequestDTO): Promise<Post_CreatePostResponseDTO> {
		const { title, content, media } = dto;
		const createdPost = await this.postModel.create({
			title,
			content,
			media,
			// createdBy: 
		});
        const savedPost = await createdPost.save();

        // store to ElasticSearch

        // call to FeedService to build new feed

		return {
			id: savedPost.id
		}
	}
}
