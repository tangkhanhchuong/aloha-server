import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { UserStatuses } from 'shared/constants/user';

import { DTO, HttpMedthod } from '../base.dto';

export class User_FindUsersRequestBodyDTO {
	@ApiProperty({ isArray: true, default: [] })
	@IsArray()
    userIds?: string[];

    @ApiProperty({ default: 'example@gmail.com' })
	email?: string;
}

export class User_UserResponseDTO {
	@ApiProperty({ default: '' })
	userId: string;

	@ApiProperty({ default: 'example' })
	username: string;

	@ApiProperty({ default: 'example@gmail.com' })
	email: string;
	
	@ApiProperty({ enum: UserStatuses, default: UserStatuses.INACTIVE })
	status: UserStatuses;
}

export class User_FindUsersResponseDTO {
	@ApiProperty({ isArray: true, type: User_UserResponseDTO })
	users: User_UserResponseDTO[];
}

export class User_FindUsersDTO extends DTO {
	public static url = '/users';
	public HttpMedthod = HttpMedthod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: User_FindUsersRequestBodyDTO,
		public responseDTO: User_FindUsersResponseDTO
	) {
		super();
	}
}
