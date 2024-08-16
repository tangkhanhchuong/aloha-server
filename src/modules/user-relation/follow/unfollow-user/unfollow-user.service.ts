import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { Neo4jService } from 'core/neo4j/neo4j.service';
import {
	GraphLabels,
	SocialRelations
} from 'shared/constants/neo4j';
import {
	UserRelation_UnfollowUserResponseDTO
} from 'shared/dto/user-relation/unfollow-user.dto';
import { SearchUsersService } from 'src/modules/user/user-management/search-users/search-users.service';
import { User } from 'database/user/user';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UnfollowUserService {
	constructor(
		private readonly neo4jService: Neo4jService,
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(userId: string, followerId: string): Promise<UserRelation_UnfollowUserResponseDTO> {
		if (
			userId === followerId
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followeeId');
		}

		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new NotFoundException("User not found");
		}

		const followRelations = await this.neo4jService.getDestinationNodes(
			SocialRelations.FOLLOW_USER,
			{ id: userId, label: GraphLabels.USER },
			{ id: followerId, label: GraphLabels.USER }
		);
		if (!followRelations[0]) {
			throw new ConflictException("You haven't followed this user yet");
		}
		const result = await this.neo4jService.removeRelation(
			SocialRelations.FOLLOW_USER,
			userId,
			GraphLabels.USER,
			followerId,
			GraphLabels.USER,
		);
		return {
			status: result
		};
	}
}
