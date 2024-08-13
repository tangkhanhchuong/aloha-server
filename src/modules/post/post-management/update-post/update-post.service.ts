import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import {
    Post_UpdatePostRequestBodyDTO,
    Post_UpdatePostResponseDTO,
} from 'shared/dto/post/update-post.dto';

@Injectable()
export class Post_UpdatePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
    async execute(id: string, dto: Post_UpdatePostRequestBodyDTO): Promise<Post_UpdatePostResponseDTO> {
        const { title, content, media } = dto;
        const updatedPost = await this.postModel.updateOne(
            { id },
            { title, content, media }
        );

		return { id: updatedPost.upsertedId.toString() }
	}
}
