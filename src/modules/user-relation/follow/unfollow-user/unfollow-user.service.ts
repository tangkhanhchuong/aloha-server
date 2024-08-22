import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { UserRelations } from 'shared/business/user/user';
import {
	UserRelation_UnfollowUserRequestParamDTO,
	UserRelation_UnfollowUserResponseDTO
} from 'shared/dto/user-relation/unfollow-user.dto';

@Injectable()
export class UnfollowUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>
	) {}

	async execute(
		paramDTO: UserRelation_UnfollowUserRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<UserRelation_UnfollowUserResponseDTO> {
		const { userId } = authUser;
		const { userId: followerId } = paramDTO;
		if (
			userId === followerId
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followeeId');
		}
		
		const userRelation = await this.userRelationModel.findOne({
			createdBy: userId,
			target: followerId,
			relationType: UserRelations.FOLLOW
		})
		if (!userRelation) {
			throw new ConflictException("You haven't already follow this user yet!");
		}
		await this.userRelationModel.deleteOne({
			createdBy: userId,
			target: followerId,
			relationType: UserRelations.FOLLOW
		});
		
		// TODO: Async tasks
		// Increase number of followers and number of followees
		await this.userModel.findByIdAndUpdate(
			followerId,
			{ $inc: { numberOfFollowers: -1 } },
			{ new: true }
		);

		// Notification

		return {
			status: true
		};
	}
}
