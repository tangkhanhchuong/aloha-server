import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { UserStatus } from 'shared/constants/user';

import { DTO, METHOD } from '../base.dto';

export class User_FindUsersRequestDTO {
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
	
	@ApiProperty({ enum: UserStatus, default: UserStatus.INACTIVE })
	status: UserStatus;
}

export class User_FindUsersResponseDTO {
	@ApiProperty({ isArray: true, type: User_UserResponseDTO })
	users: User_UserResponseDTO[];
}

export class User_FindUsersDTO extends DTO {
	public static url = '/users';
	public method = METHOD.GET;

	public bodyDTO: undefined;

	constructor(
		public queryDTO: User_FindUsersRequestDTO,
		public responseDTO: User_FindUsersResponseDTO
	) {
		super();
	}
}
