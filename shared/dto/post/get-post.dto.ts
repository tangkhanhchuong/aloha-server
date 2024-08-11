import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const Post_GetPostURL = 'post/get-post/:id';

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
