import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const Auth_ChangePasswordURL = 'auth/password';

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
