import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import {
    Post_PostCreatePostRequestDTO,
    Post_PostCreatePostResponseDTO,
} from 'shared/dto/post/create-post.dto';

@Injectable()
export class CreatePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
	async execute(dto: Post_PostCreatePostRequestDTO): Promise<Post_PostCreatePostResponseDTO> {
		const { title, content, media } = dto;
        const createdPost = await this.postModel.create({ title, content, media });
        const savedPost = await createdPost.save();

        // store to ElasticSearch

        // call to FeedService to build new feed

		return {
			id: savedPost.id
		}
	}
}
