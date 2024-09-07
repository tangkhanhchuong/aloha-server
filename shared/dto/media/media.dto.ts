
import { Type } from "class-transformer";
import { IsString } from "class-validator";

import { UserDTO } from "../user/user.dto";

export class MediaDTO {
	@IsString()
    url: string[];
    
	@IsString()
    createdAt: string;

	@Type(() => UserDTO)
    createdBy: UserDTO;
}