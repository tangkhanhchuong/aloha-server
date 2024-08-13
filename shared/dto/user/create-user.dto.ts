import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class User_CreateUserRequestBodyDTO {
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
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_CreateUserRequestBodyDTO,
		public responseDTO: User_CreateUserResponseDTO
	) {
		super();
	}
}
