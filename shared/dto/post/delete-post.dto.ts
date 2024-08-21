import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_DeletePostRequestParamDTO {
	@IsString()
	postId: boolean;
}

export class Post_DeletePostResponseDTO {
	@IsString()
	status: boolean;
}

export class Post_DeletePostDTO extends DTO {
	public static url = '/posts/:postId';
	public method = HttpMethod.DELETE;

	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public paramDTO: Post_DeletePostRequestParamDTO,
		public responseDTO: Post_DeletePostResponseDTO
	) {
		super();
	}
}