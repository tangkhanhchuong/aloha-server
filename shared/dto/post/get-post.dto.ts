import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class Post_GetPostResponseDTO {
	@ApiProperty({
		type: String,
		default: 'Found Post',
		required: true,
	})
	@IsString()
	title: string;

	@ApiProperty({
		type: String,
		default: 'Found Post Content',
		required: true,
	})
	@IsString()
    content: string;

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	@IsString()
	media: string[];
}

export class Post_GetPostDTO extends DTO {
	public static url = '/posts';
	public method = METHOD.GET;

	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public responseDTO: Post_GetPostResponseDTO
	) {
		super();
	}
}
