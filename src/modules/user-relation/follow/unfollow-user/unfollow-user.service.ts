import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'database/user/user';
import {
	UserRelation_UnfollowUserResponseDTO
} from 'shared/dto/user-relation/unfollow-user.dto';
import { UserRelation } from 'database/user-relation/user-relation';
import { UserRelations } from 'shared/constants/user';

@Injectable()
export class UnfollowUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>
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

		await this.userRelationModel.deleteOne({
			createdBy: userId,
			targetId: followerId,
			relationType: UserRelations.FOLLOW
		});

		return {
			status: true
		};
	}
}
