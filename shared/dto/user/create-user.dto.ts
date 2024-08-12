import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class User_CreateUserRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example',
		required: true,
	})
	@IsString()
	@MaxLength(25)
	username: string;

	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}

export class User_CreateUserResponseDTO {
	@IsString()
	id: string;
}

export class User_CreateUserDTO extends DTO {
	public static url = '/users';
	public method = METHOD.POST;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_CreateUserRequestDTO,
		public responseDTO: User_CreateUserResponseDTO
	) {
		super();
	}
}
