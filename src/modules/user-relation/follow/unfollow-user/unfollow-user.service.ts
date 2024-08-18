import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { UserRelations } from 'shared/constants/user';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
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
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new NotFoundException("User not found");
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

		return {
			status: true
		};
	}
}
