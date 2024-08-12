import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GRAPH_LABELS,
	SOCIAL_RELATIONS
} from 'shared/constants/neo4j';
import {
	UserRelation_FollowUserResponseDTO
} from 'shared/dto/user-relation/follow-user.dto';
import { SearchUsersService } from 'src/modules/user/user-management/search-users/search-users.service';

@Injectable()
export class FollowUserService {
	constructor(
		private readonly neo4jService: Neo4jService,
		private readonly searchUsersService: SearchUsersService
	) {}

	async execute(userId: string, followerId: string): Promise<UserRelation_FollowUserResponseDTO> {
		if (
			userId === followerId
			|| !isValidObjectId(userId)
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followerId');
		}

		const users = await this.searchUsersService.execute({
			userIds: [userId]
		})
		if (users.total === 0) {
			throw new NotFoundException("User not found");
		}

		const followRelation = await this.neo4jService.getDestinationNodes(
			SOCIAL_RELATIONS.FOLLOW,
			userId,
			GRAPH_LABELS.USER,
			followerId,
			GRAPH_LABELS.USER,
		);
		if (followRelation[0]) {
			throw new ConflictException("You've already followed this user");
		}
		const relation = await this.neo4jService.createRelation(
			SOCIAL_RELATIONS.FOLLOW,
			userId,
			GRAPH_LABELS.USER,
			followerId,
			GRAPH_LABELS.USER,
		);
		return {
			status: true 
		};
	}
}
