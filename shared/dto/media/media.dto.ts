
import { Type } from "class-transformer";
import { IsEnum, IsString } from "class-validator";

import { MediaTypes } from "database/media/media";

import { UserDTO } from "../user/user.dto";

export class MediaDTO {
	@IsString()
    mediaId: string;

	@IsString()
    url: string;

	@IsEnum(MediaTypes)
    type: MediaTypes;
    
	@IsString()
    createdAt: string;

	@Type(() => UserDTO)
    createdBy: UserDTO;
}