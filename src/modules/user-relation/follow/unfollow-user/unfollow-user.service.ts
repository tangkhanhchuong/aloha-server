import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GRAPH_LABELS,
	SOCIAL_RELATIONS
} from 'shared/constants/neo4j';
import {
	UserRelation_UnfollowUserRequestDTO,
	UserRelation_UnfollowUserResponseDTO
} from 'shared/dto/user-relation/unfollow-user.dto';
import { SearchUsersService } from 'src/modules/user/user-management/search-users/search-users.service';

@Injectable()
export class UnfollowUserService {
	constructor(
		private readonly neo4jService: Neo4jService,
		private readonly searchUsersService: SearchUsersService
	) {}

	async execute(body: UserRelation_UnfollowUserRequestDTO): Promise<UserRelation_UnfollowUserResponseDTO> {
		if (
			body.userId === body.followeeId
			|| !isValidObjectId(body.userId)
			|| !isValidObjectId(body.followeeId)
		) {
			throw new BadRequestException('Invalid userId or followeeId');
		}

		const users = await this.searchUsersService.execute({
			userIds: [body.userId]
		})
		if (users.total === 0) {
			throw new NotFoundException("User not found");
		}

		const followRelation = await this.neo4jService.getDestinationNodes(
			SOCIAL_RELATIONS.FOLLOW,
			body.userId,
			GRAPH_LABELS.USER,
			body.followeeId,
			GRAPH_LABELS.USER,
		);
		if (!followRelation[0]) {
			throw new ConflictException("You haven't followed this user yet");
		}
		const result = await this.neo4jService.removeRelation(
			SOCIAL_RELATIONS.FOLLOW,
			body.userId,
			GRAPH_LABELS.USER,
			body.followeeId,
			GRAPH_LABELS.USER,
		);
		return {
			status: result
		};
	}
}
