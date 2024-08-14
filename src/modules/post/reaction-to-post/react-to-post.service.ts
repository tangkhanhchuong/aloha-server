import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import { Post } from 'database/post/post';
import { GraphLabels, SocialRelations } from 'shared/constants/neo4j';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Post_ReactToPostRequestBodyDTO,
	Post_ReactToPostRequestParamDTO,
	Post_ReactToPostResponseDTO,
} from 'shared/dto/post/react-to-post.dto';

@Injectable()
export class ReactToPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly neo4jService: Neo4jService,
    ) {}
    
	async execute(
		bodyDTO: Post_ReactToPostRequestBodyDTO,
		paramDTO: Post_ReactToPostRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<Post_ReactToPostResponseDTO> {
		const { reaction } = bodyDTO;
		const { postId } = paramDTO;
		const { userId } = authUser;

		const post = await this.postModel.findById(postId).exec();
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		const postReactions = await this.neo4jService.getDestinationNodes(
			SocialRelations.REACT_POST,
			userId,
			GraphLabels.USER,
			postId,
			GraphLabels.POST,
		);

		if (!postReactions[0]) {
			await this.neo4jService.createRelation(
				SocialRelations.REACT_POST,
				userId,
				GraphLabels.USER,
				postId,
				GraphLabels.POST,
				{
					type: bodyDTO.reaction
				}
			);
			return {
				isReacted: true
			};
		} else {
			await this.neo4jService.removeRelation(
				SocialRelations.REACT_POST,
				userId,
				GraphLabels.USER,
				postId,
				GraphLabels.POST,
			);

			return {
				isReacted: false
			};
		}
	}
}
