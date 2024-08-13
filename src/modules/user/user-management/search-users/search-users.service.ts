import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'database/user/user';
import {
	User_SearchUsersRequestBodyDTO,
	User_SearchUsersResponseDTO
} from 'shared/dto/user/search-users.dto';

@Injectable()
export class SearchUsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(body: User_SearchUsersRequestBodyDTO): Promise<User_SearchUsersResponseDTO> {
		let query;
		if (body.userIds) {
			query = this.userModel.find({
				_id: {
					$in: body.userIds
				}
			});
		} else {
			query = this.userModel.find();
		}


		const items = await query	
			.skip(body.limit * (+body.page - 1))
			.limit(body.limit)
			.exec();
		const count = items.length;
		
		return new User_SearchUsersResponseDTO(
			items.map((item) => ({
				username: item.username,
				avatar: item.avatar,
				email: item.email
			})),
			body.page,
			body.limit,
			count,
		);
	}
}
