import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class Post_CreatePostRequestDTO {
	@ApiProperty({
		type: String,
		default: 'New Post',
		required: true,
	})
	@IsString()
	title: string;

	@ApiProperty({
		type: String,
		default: 'New Post Content',
		required: true,
	})
	@IsString()
    content: string;

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	media: string[];
}

export class Post_CreatePostResponseDTO {
	@IsString()
	id: string;
}

export class Post_CreatePostDTO extends DTO {
	public static url = '/posts';
	public method = METHOD.POST;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_CreatePostRequestDTO,
		public responseDTO: Post_CreatePostResponseDTO
	) {
		super();
	}
}
