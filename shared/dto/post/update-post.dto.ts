import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

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


export class Post_UpdatePostDTO extends DTO {
	public static url = '/posts/:id';
	public method = METHOD.PATCH;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_UpdatePostRequestDTO,
		public responseDTO: Post_UpdatePostResponseDTO
	) {
		super();
	}
}