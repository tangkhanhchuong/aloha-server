import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { Post_DeletePostResponseDTO } from 'shared/dto/post/delete-post.dto';

@Injectable()
export class DeletePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
    async execute(id: string): Promise<Post_DeletePostResponseDTO> {
        const deletedPost = await this.postModel.deleteOne({ id })
		return { status: deletedPost.acknowledged }
	}
}
