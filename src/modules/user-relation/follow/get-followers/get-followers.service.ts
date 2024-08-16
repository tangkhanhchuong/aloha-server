import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import {
	UserRelation_GetFollowersRequestQueryDTO,
	UserRelation_GetFollowersResponseDTO
} from 'shared/dto/user-relation/get-followers.dto';

@Injectable()
export class GetFollowersService {
	constructor(
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>
	) {}

	async execute(
		queryDTO: UserRelation_GetFollowersRequestQueryDTO,
		userId: string
	): Promise<UserRelation_GetFollowersResponseDTO> {
		const items = await this.userRelationModel.find()
			.where({ targetId: userId })
			.skip(queryDTO.limit * (+queryDTO.page - 1))
			.limit(queryDTO.limit)
			.exec();
		const count = items.length;
		
		return new UserRelation_GetFollowersResponseDTO(
			items.map((item) => ({
				userId: item.targetId.toString()
			})),
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
