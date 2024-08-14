import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GraphLabels,
	SocialRelations
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
            SocialRelations.FOLLOW_USER,
            userId,
			GraphLabels.USER
		)
		return {
			followees: followees.map(follower => ({
				userId: follower.userId
			}))
		};
	}
}
