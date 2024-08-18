import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { PostReactions } from 'shared/constants/post';

import { DTO, HttpMethod } from '../base.dto';

export class Post_ReactToPostRequestBodyDTO {
	@IsEnum(PostReactions)
	@IsOptional()
	reaction?: PostReactions;
}

export class Post_ReactToPostRequestParamDTO {
	@IsMongoId()
	postId: string;
}

export class Post_ReactToPostResponseDTO {
	@IsBoolean()
	isReacted: boolean;
}

export class Post_ReactToPostDTO extends DTO {
	public static url = '/posts/:postId/reactions';
	public method = HttpMethod.POST;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_ReactToPostRequestBodyDTO,
		public paramDTO: Post_ReactToPostRequestParamDTO,
		public responseDTO: Post_ReactToPostResponseDTO
	) {
		super();
	}
}
