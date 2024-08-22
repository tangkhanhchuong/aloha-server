import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { UserRelations } from 'shared/business/user/user';
import {
	UserRelation_GetFollowersRequestQueryDTO,
	UserRelation_GetFollowersResponseDTO
} from 'shared/dto/user-relation/get-followers.dto';
import { UserMapper } from 'shared/mappers/user.mapper';

@Injectable()
export class GetFollowersService {
	constructor(
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>,
		private readonly userMapper: UserMapper
	) {}

	async execute(
		queryDTO: UserRelation_GetFollowersRequestQueryDTO,
		authUser: AuthUserPayload
	): Promise<UserRelation_GetFollowersResponseDTO> {
		const { limit, page } = queryDTO;
		const { userId } = authUser;

		const filter = {
			target: userId,
			relationType: UserRelations.FOLLOW,
			deletedAt: { $ne: null }
		};
		const [followerEntities, count] = await Promise.all([
			this.userRelationModel.find(filter)
				.populate('target')
				.skip(limit * (+page - 1))
				.limit(limit)
				.exec(),
			this.userRelationModel.countDocuments(filter)
		]);
		const followerDTOs = await Promise.all(followerEntities
			.map((userRelationEntity) => this.userMapper.entityToDTO((userRelationEntity.createdBy) as User)));

		return new UserRelation_GetFollowersResponseDTO(
			followerDTOs,
			page,
			limit,
			1,
		);
	}
}
