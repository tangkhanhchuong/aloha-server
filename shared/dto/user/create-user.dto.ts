import { IsEmail, IsString, MaxLength } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class User_CreateUserRequestBodyDTO {
	@IsString()
	@MaxLength(25)
	username: string;

	@IsEmail()
	email: string;
}

export class User_CreateUserResponseDTO {
	@IsString()
	id: string;
}

export class User_CreateUserDTO extends DTO {
	public static url = '/users';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_CreateUserRequestBodyDTO,
		public responseDTO: User_CreateUserResponseDTO
	) {
		super();
	}
}
