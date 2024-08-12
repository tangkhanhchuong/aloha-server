import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GRAPH_LABELS,
	SOCIAL_RELATIONS
} from 'shared/constants/neo4j';
import {
	UserRelation_GetFollowersRequestDTO,
	UserRelation_GetFollowersResponseDTO
} from 'shared/dto/user-relation/get-followers.dto';

@Injectable()
export class GetFollowersService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(body: UserRelation_GetFollowersRequestDTO): Promise<UserRelation_GetFollowersResponseDTO> {
		const followers = await this.neo4jService.getSourceNodes(
            SOCIAL_RELATIONS.FOLLOW,
            body.userId,
			GRAPH_LABELS.USER
		)
		return {
			followers: followers.map(follower => ({
				userId: follower.userId
			}))
		};
	}
}
