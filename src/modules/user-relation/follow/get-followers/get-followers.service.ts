import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GraphLabels,
	SocialRelations
} from 'shared/constants/neo4j';
import {
	UserRelation_GetFollowersResponseDTO
} from 'shared/dto/user-relation/get-followers.dto';

@Injectable()
export class GetFollowersService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(userId: string): Promise<UserRelation_GetFollowersResponseDTO> {
		const followers = await this.neo4jService.getSourceNodes(
            SocialRelations.FOLLOW,
            userId,
			GraphLabels.USER
		)
		return {
			followers: followers.map(follower => ({
				userId: follower.userId
			}))
		};
	}
}
