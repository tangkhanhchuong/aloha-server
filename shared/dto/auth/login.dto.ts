import { IsEmail, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Auth_LoginRequestBodyDTO {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}


export class Auth_LoginResponseDTO {
	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;
}

export class Auth_LoginDTO extends DTO {
	public static url = '/auth/login';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Auth_LoginRequestBodyDTO,
		public responseDTO: Auth_LoginResponseDTO
	) {
		super();
	}
}