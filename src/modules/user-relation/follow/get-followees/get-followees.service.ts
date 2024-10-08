import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import { User } from 'database/user/user';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { UserRelations } from 'shared/business/user/user';
import {
	UserRelation_GetFolloweesRequestQueryDTO,
	UserRelation_GetFolloweesResponseDTO
} from 'shared/dto/user-relation/get-followees.dto';
import { UserMapper } from 'shared/mappers/user.mapper';

@Injectable()
export class GetFolloweesService {
	constructor(
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>,
		private readonly userMapper: UserMapper
	) {}

	async execute(
		queryDTO: UserRelation_GetFolloweesRequestQueryDTO,
		authUser: AuthUserPayload
	): Promise<UserRelation_GetFolloweesResponseDTO> {
		const { limit, page } = queryDTO;
		const { userId } = authUser;

		const filter = {
			createdBy: userId,
			relationType: UserRelations.FOLLOW,
			deletedAt: { $ne: null }
		};
		const [userRelationEntities, count] = await Promise.all([
			this.userRelationModel.find(filter)
				.populate('target')
				.skip(limit * (+page - 1))
				.limit(limit)
				.exec(),
			this.userRelationModel.countDocuments(filter)
		]);
		const followeeDTOs = await Promise.all(userRelationEntities
			.map((userRelationEntity) => this.userMapper.entityToDTO((userRelationEntity.target) as User)));

		return new UserRelation_GetFolloweesResponseDTO(
			followeeDTOs,
			page,
			limit,
			count,
		);
	}
}
