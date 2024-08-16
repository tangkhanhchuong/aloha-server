import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Neo4jService } from 'core/neo4j/neo4j.service';
import { User } from 'database/user/user';
import {
	GraphLabels,
	SocialRelations
} from 'shared/constants/neo4j';
import {
	UserRelation_FollowUserResponseDTO
} from 'shared/dto/user-relation/follow-user.dto';

@Injectable()
export class FollowUserService {
	constructor(
		private readonly neo4jService: Neo4jService,
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(userId: string, followerId: string): Promise<UserRelation_FollowUserResponseDTO> {
		if (
			userId === followerId
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followerId');
		}

		const user = await this.userModel.findById(userId)
		if (!user) {
			throw new NotFoundException("User not found");
		}

		const followRelations = await this.neo4jService.getDestinationNodes(
			SocialRelations.FOLLOW_USER,
			{ id: userId, label: GraphLabels.USER },
			{ id: followerId, label: GraphLabels.USER }
		);
		if (followRelations[0]) {
			throw new ConflictException("You've already followed this user");
		}
		const relation = await this.neo4jService.createRelation(
			SocialRelations.FOLLOW_USER,
			{ id: userId, label: GraphLabels.USER },
			{ id: followerId, label: GraphLabels.USER }
		);
		return {
			status: true 
		};
	}
}
