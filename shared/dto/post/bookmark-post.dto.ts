import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_BookmarkPostRequestParamDTO {
	@IsString()
	postId: string;
}

export class Post_BookmarkPostResponseDTO {
	@IsString()
	status: boolean;
}

export class Post_BookmarkPostDTO extends DTO {
	public static url = '/posts/:postId/bookmark';
	public method = HttpMethod.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public paramDTO: Post_BookmarkPostRequestParamDTO,
		public responseDTO: Post_BookmarkPostResponseDTO
	) {
		super();
	}
}