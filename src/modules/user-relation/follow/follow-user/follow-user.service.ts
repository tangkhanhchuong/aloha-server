import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { UserRelations } from 'shared/constants/user';
import {
	UserRelation_FollowUserResponseDTO
} from 'shared/dto/user-relation/follow-user.dto';

@Injectable()
export class FollowUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>
	) {}

	async execute(userId: string, followerId: string): Promise<UserRelation_FollowUserResponseDTO> {
		if (
			userId === followerId
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followerId');
		}

		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		const userRelation = await this.userRelationModel.findOne({
			createdBy: userId,
			targetId: followerId,
			relationType: UserRelations.FOLLOW
		})
		if (userRelation) {
			throw new ConflictException('You have already follow this user!');
		}
		const newUserRelation = new this.userRelationModel({
            createdBy: userId,
            targetId: followerId,
            relationType: UserRelations.FOLLOW
		});
		await newUserRelation.save();

		return {
			status: true
		};
	}
}
