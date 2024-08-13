import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	User_FindUsersRequestBodyDTO,
	User_FindUsersResponseDTO
} from 'shared/dto/user/find-users.dto';

@Injectable()
export class FindUsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(query: User_FindUsersRequestBodyDTO): Promise<User_FindUsersResponseDTO> {
		let conditions = {};
		if (query.userIds) {
			conditions['_id'] = {
				$in: query.userIds
			};
		}
		if (query.email) {
			conditions['email'] = query.email;
		}

		const items = await this.userModel.find(conditions).exec();
		return {
			users: items.map(item => ({
				userId: item.id,
                username: item.username,
                email: item.email,
                status: item.status
            }))
		};
	}
}
