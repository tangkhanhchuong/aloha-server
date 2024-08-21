import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { UserRelations } from 'shared/constants/user';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	UserRelation_FollowUserRequestParamDTO,
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

	async execute(
		paramDTO: UserRelation_FollowUserRequestParamDTO,
		authUser: AuthUserPayload
	): Promise<UserRelation_FollowUserResponseDTO> {
		const { userId } = authUser;
		const { userId: followerId } = paramDTO

		if (
			userId === followerId
			|| !isValidObjectId(followerId)
		) {
			throw new BadRequestException('Invalid userId or followerId');
		}

		const userRelation = await this.userRelationModel.findOne({
			createdBy: userId,
			target: followerId,
			relationType: UserRelations.FOLLOW
		})
		if (userRelation) {
			throw new ConflictException('You have already follow this user!');
		}
		const newUserRelation = new this.userRelationModel({
            createdBy: userId,
            target: followerId,
            relationType: UserRelations.FOLLOW
		});
		await newUserRelation.save();

		// TODO: Async tasks
		// Increase number of followers and number of followees
		await this.userModel.findByIdAndUpdate(
			followerId,
			{ $inc: { numberOfFollowers: 1 } },
			{ new: true }
		);

		// Notification

		return {
			status: true
		};
	}
}
