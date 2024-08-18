import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import { User } from 'database/user/user';
import { Post_GetPostResponseDTO } from 'shared/dto/post/get-post.dto';
import { PostMapper } from 'shared/mappers/post.mapper';

@Injectable()
export class GetPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly postMapper: PostMapper
    ) {}
    
	async execute(id: string): Promise<Post_GetPostResponseDTO> {
		const postEntity = await this.postModel.findById(id).populate('createdBy');

		const postDTO = await this.postMapper.entityToDTO(postEntity as (Post & { createdBy: User })); 
		return postDTO;
	}
}
