import { IsBoolean, IsString } from "class-validator";

export class UserDTO {
	@IsString()
	userId: string;

	@IsBoolean()
	isFollowed?: boolean;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	avatar?: string;

	@IsString()
	fullname?: string;

	@IsString()
	slug?: string;

	@IsString()
	bio?: string;
}