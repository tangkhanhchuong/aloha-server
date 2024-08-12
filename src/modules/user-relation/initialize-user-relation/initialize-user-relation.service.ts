import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import { GRAPH_LABELS } from 'shared/constants/neo4j';
import {
	UserRelation_IntializeUserRelationRequestDTO,
	UserRelation_IntializeUserRelationResponseDTO
} from 'shared/dto/user-relation/initialize-user-relation.dto';

@Injectable()
export class InitializeUserRelationService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(body: UserRelation_IntializeUserRelationRequestDTO)
		: Promise<UserRelation_IntializeUserRelationResponseDTO> {
		const newNode: Record<string, string>
			= await this.neo4jService.createNode(GRAPH_LABELS.USER, {
				userId: body.userId,
			});
		return {
			userId: newNode.userId
		};
	}
}
