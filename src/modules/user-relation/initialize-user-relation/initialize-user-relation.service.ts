import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import { GraphLabels } from 'shared/constants/neo4j';
import {
	UserRelation_IntializeUserRelationRequestBodyDTO,
	UserRelation_IntializeUserRelationResponseDTO
} from 'shared/dto/user-relation/initialize-user-relation.dto';

@Injectable()
export class InitializeUserRelationService {
	constructor(
		private readonly neo4jService: Neo4jService
	) {}

	async execute(body: UserRelation_IntializeUserRelationRequestBodyDTO)
		: Promise<UserRelation_IntializeUserRelationResponseDTO> {
		const newNode: Record<string, string>
			= await this.neo4jService.createNode(GraphLabels.USER, {
				userId: body.userId,
				name: body.name
			});
		return {
			userId: newNode.userId
		};
	}
}
