import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const Post_DeletePostURL = 'post/delete-post/:id';

export class Post_DeletePostResponseDTO {
	@ApiProperty({
		type: Boolean,
		example: true
	})
	@IsString()
	status: boolean;
}
