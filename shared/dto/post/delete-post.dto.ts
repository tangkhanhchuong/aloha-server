import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_DeletePostResponseDTO {
	@IsString()
	status: boolean;
}

export class Post_DeletePostDTO extends DTO {
	public static url = '/posts/:id';
	public method = HttpMethod.DELETE;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public responseDTO: Post_DeletePostResponseDTO
	) {
		super();
	}
}