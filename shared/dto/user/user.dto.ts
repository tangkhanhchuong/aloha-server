import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
	@ApiProperty({ default: '' })
	userId: string;

	@ApiProperty({ default: 'example' })
	username: string;

	@ApiProperty({ default: 'example@gmail.com' })
	email: string;

	@ApiProperty({ default: 'http://avatar.png' })
	avatar?: string;
}