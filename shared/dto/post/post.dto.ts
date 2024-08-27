
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

import { UserDTO } from "../user/user.dto";

export class PostDTO {
	@IsArray()
	fileUrls: string[];

	@IsString()
	postId: string;

	@IsBoolean()
	isReacted: boolean;

	@IsString()
	title: string;

	@IsString()
	content: string;

	@IsNumber()
    numberOfReactions: number;

	@IsNumber()
    numberOfComments: number;

	@IsString()
    createdAt: string;

	@Type(() => UserDTO)
    createdBy: UserDTO;
}