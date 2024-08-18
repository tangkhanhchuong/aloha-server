import { ApiProperty } from "@nestjs/swagger";

import { UserDTO } from "./user.dto";

export class PostDTO {
	@ApiProperty({ isArray: true })
	fileUrls: string[];

	@ApiProperty({ default: '' })
	title: string;

	@ApiProperty({ default: '' })
	content: string;

	@ApiProperty({ default: 0 })
    numberOfReactions: number;

	@ApiProperty({ default: 0 })
    numberOfComments: number;

	@ApiProperty({ default: '' })
    createdAt: string;

	@ApiProperty({ type: UserDTO })
    createdBy: UserDTO;
}