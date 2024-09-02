import { IsArray, IsOptional, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_CreatePostRequestBodyDTO {
	@IsString({ message: 'Content is not a string' })
    content: string;

	@IsArray({ message: 'Content is not a string' })
	@IsOptional({ message: 'Content is required' })
	media: string[];
}

export class Post_CreatePostResponseDTO {
	@IsString()
	id: string;
}

export class Post_CreatePostDTO extends DTO {
	public static url = '/posts';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_CreatePostRequestBodyDTO,
		public responseDTO: Post_CreatePostResponseDTO
	) {
		super();
	}
}
