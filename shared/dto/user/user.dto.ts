import { IsOptional, IsString } from "class-validator";

export class UserDTO {
	@IsString()
	userId: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	@IsOptional()
	avatar?: string;
}