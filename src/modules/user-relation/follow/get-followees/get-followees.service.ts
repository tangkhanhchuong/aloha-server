import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GRAPH_LABELS,
	SOCIAL_RELATIONS
} from 'shared/constants/neo4j';
import {
	UserRelation_GetFolloweesResponseDTO
} from 'shared/dto/user-relation/get-followees.dto';

@Injectable()
export class GetFolloweesService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(userId: string): Promise<UserRelation_GetFolloweesResponseDTO> {
		const followees = await this.neo4jService.getDestinationNodes(
            SOCIAL_RELATIONS.FOLLOW,
            userId,
			GRAPH_LABELS.USER
		)
		return {
			followees: followees.map(follower => ({
				userId: follower.userId
			}))
		};
	}
}
