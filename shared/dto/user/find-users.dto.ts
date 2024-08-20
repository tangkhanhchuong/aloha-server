import { IsArray, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';
import { UserDTO } from './user.dto';

export class User_FindUsersRequestBodyDTO {
	@IsArray()
    userIds?: string[];

	@IsString()
	email?: string;
}

export class User_FindUsersResponseDTO {
	@IsArray()
	users: UserDTO[];
}

export class User_FindUsersDTO extends DTO {
	public static url = '/users';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: User_FindUsersRequestBodyDTO,
		public responseDTO: User_FindUsersResponseDTO
	) {
		super();
	}
}
