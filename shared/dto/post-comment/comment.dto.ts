
import { Type } from "class-transformer";
import { IsEnum, IsString } from "class-validator";

import { CommentTypes } from "shared/constants/comment";

import { UserDTO } from "../user/user.dto";

export class CommentDTO {
    @IsString()
    content: string
    
    @IsEnum(CommentTypes)
	type: CommentTypes;

	@IsString()
    createdAt: string;

	@Type(() => UserDTO)
    createdBy: UserDTO;
}