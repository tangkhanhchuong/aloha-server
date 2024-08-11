import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const Post_PostCreatePostURL = 'post/create-post';

export class Post_PostCreatePostRequestDTO {
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
	@IsString()
	media: string[];
}

export class Post_PostCreatePostResponseDTO {
	@IsString()
	id: string;
}
