import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	User_FindUsersRequestBodyDTO,
	User_FindUsersResponseDTO
} from 'shared/dto/user/find-users.dto';
import { UserMapper } from 'shared/mappers/user.mapper';

@Injectable()
export class FindUsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly userMapper: UserMapper
	) {}

	async execute(query: User_FindUsersRequestBodyDTO): Promise<User_FindUsersResponseDTO> {
		console.log('find-users')
		let conditions = {};
		if (query.userIds) {
			conditions['_id'] = {
				$in: query.userIds
			};
		}
		if (query.email) {
			conditions['email'] = query.email;
		}

		const userEntities = await this.userModel.find(conditions).exec();
		const userDTOs = await Promise.all(userEntities.map(user => this.userMapper.entityToDTO(user)));
		return {
			users: userDTOs
		};
	}
}
