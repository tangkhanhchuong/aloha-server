import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Auth_LoginRequestBodyDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	password: string;
}


export class Auth_LoginResponseDTO {
	@ApiProperty({
		default: '',
	})
	accessToken: string;

	@ApiProperty({
		default: '',
	})
	@IsEmail()
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