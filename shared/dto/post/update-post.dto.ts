import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class Post_UpdatePostRequestBodyDTO {
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
	public HttpMedthod = HttpMedthod.PATCH;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_UpdatePostRequestBodyDTO,
		public responseDTO: Post_UpdatePostResponseDTO
	) {
		super();
	}
}