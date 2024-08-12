import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class Auth_ChangePasswordRequestDTO {
	email: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	oldPassword: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	newPassword: string;
}

export class Auth_ChangePasswordDTO extends DTO {
	public static url = '/auth/change-password';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ChangePasswordRequestDTO,
	) {
		super();
	}
}
