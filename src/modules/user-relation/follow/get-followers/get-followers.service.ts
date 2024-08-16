import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GraphLabels,
	SocialRelations
} from 'shared/constants/neo4j';
import {
	UserRelation_GetFollowersRequestQueryDTO,
	UserRelation_GetFollowersResponseDTO
} from 'shared/dto/user-relation/get-followers.dto';

@Injectable()
export class GetFollowersService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(
		queryDTO: UserRelation_GetFollowersRequestQueryDTO,
		userId: string
	): Promise<UserRelation_GetFollowersResponseDTO> {
		const { items, count } = await this.neo4jService.getSourceNodes(
			SocialRelations.FOLLOW_USER,
			{ id: userId, label: GraphLabels.USER }
		)
			
		return new UserRelation_GetFollowersResponseDTO(
			items.map(item => ({ userId:item.id })),
			queryDTO.page,
			queryDTO.limit,
			count,
		)
	}
}
