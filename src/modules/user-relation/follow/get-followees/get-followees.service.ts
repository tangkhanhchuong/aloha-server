import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GraphLabels,
	SocialRelations
} from 'shared/constants/neo4j';
import {
	UserRelation_GetFolloweesRequestQueryDTO,
	UserRelation_GetFolloweesResponseDTO
} from 'shared/dto/user-relation/get-followees.dto';

@Injectable()
export class GetFolloweesService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(
		queryDTO: UserRelation_GetFolloweesRequestQueryDTO,
		userId: string
	): Promise<UserRelation_GetFolloweesResponseDTO> {
		const { items, count } = await this.neo4jService.getDestinationNodes(
			SocialRelations.FOLLOW_USER,
			{ id: userId, label: GraphLabels.USER },
			null,
			{ skip:queryDTO.limit * (+queryDTO.page - 1), limit: queryDTO.limit}
		)

		return new UserRelation_GetFolloweesResponseDTO(
			items.map(item => ({ userId:item.id })),
			queryDTO.page,
			queryDTO.limit,
			count,
		)
	}
}
