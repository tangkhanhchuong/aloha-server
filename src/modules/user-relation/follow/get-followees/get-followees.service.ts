import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRelation } from 'database/user-relation/user-relation';
import {
	UserRelation_GetFolloweesRequestQueryDTO,
	UserRelation_GetFolloweesResponseDTO
} from 'shared/dto/user-relation/get-followees.dto';

@Injectable()
export class GetFolloweesService {
	constructor(
		@InjectModel(UserRelation.name)
		private readonly userRelationModel: Model<UserRelation>
	) {}

	async execute(
		queryDTO: UserRelation_GetFolloweesRequestQueryDTO,
		userId: string
	): Promise<UserRelation_GetFolloweesResponseDTO> {
		const items = await this.userRelationModel.find()
			.where({ createdBy: userId })
			.skip(queryDTO.limit * (+queryDTO.page - 1))
			.limit(queryDTO.limit)
			.exec();
		const count = items.length;
		
		return new UserRelation_GetFolloweesResponseDTO(
			items.map((item) => ({
				userId: item.targetId.toString()
			})),
			queryDTO.page,
			queryDTO.limit,
			count,
		);
	}
}
