import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { PostReactions } from 'shared/constants/post';

import { DTO, HttpMedthod } from '../base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class Post_ReactToPostRequestBodyDTO {
	@ApiProperty({
		enum: PostReactions,
		default: PostReactions.LIKE
	})
	@IsEnum(PostReactions)
	@IsOptional()
	reaction?: PostReactions;
}

export class Post_ReactToPostRequestParamDTO {
	@ApiProperty({
		type: String
	})
	@IsMongoId()
	postId: string;
}

export class Post_ReactToPostResponseDTO {
	@ApiProperty({ type: Boolean })
	@IsBoolean()
	isReacted: boolean;
}

export class Post_ReactToPostDTO extends DTO {
	public static url = '/posts/:postId/reactions';
	public HttpMedthod = HttpMedthod.POST;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: Post_ReactToPostRequestBodyDTO,
		public paramDTO: Post_ReactToPostRequestParamDTO,
		public responseDTO: Post_ReactToPostResponseDTO
	) {
		super();
	}
}
