import { IsArray, IsOptional, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_UpdatePostRequestBodyDTO {
	@IsString()
    @IsOptional()
    content?: string;

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
	public method = HttpMethod.PATCH;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_UpdatePostRequestBodyDTO,
		public responseDTO: Post_UpdatePostResponseDTO
	) {
		super();
	}
}