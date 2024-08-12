import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class Post_DeletePostResponseDTO {
	@ApiProperty({
		type: Boolean,
		example: true
	})
	@IsString()
	status: boolean;
}

export class Post_DeletePostDTO extends DTO {
	public static url = '/posts/:id';
	public method = METHOD.DELETE;

	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public responseDTO: Post_DeletePostResponseDTO
	) {
		super();
	}
}