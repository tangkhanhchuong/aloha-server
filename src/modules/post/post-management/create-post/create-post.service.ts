import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import { Post } from 'database/post/post';
import { GraphLabels } from 'shared/constants/neo4j';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Post_CreatePostRequestBodyDTO,
	Post_CreatePostResponseDTO,
} from 'shared/dto/post/create-post.dto';

@Injectable()
export class CreatePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly neo4jService: Neo4jService
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
		await this.neo4jService.createNode(GraphLabels.POST, {
			id: createdPost.id
		});

		return {
			id: savedPost.id
		}
	}
}
