import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export const Post_UpdatePostURL = 'post/update-post/:id';

export class Post_UpdatePostRequestDTO {
	@ApiProperty({
		type: String,
		default: 'New Post',
	})
    @IsString()
    @IsOptional()
	title?: string;

	@ApiProperty({
		type: String,
		default: 'New Post Content',
		required: true,
	})
	@IsString()
    @IsOptional()
    content?: string;

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	@IsString()
	@IsOptional()
	media?: string[];
}

export class Post_UpdatePostResponseDTO {
	@IsString()
	id: string;
}
