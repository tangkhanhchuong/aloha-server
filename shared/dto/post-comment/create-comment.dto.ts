import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { CommentTypes } from 'shared/constants/comment';

import { DTO, HttpMethod } from '../base.dto';

export class PostComment_CreateCommentRequestParamDTO {
	@IsString()
	postId: string;
}

export class PostComment_CreateCommentRequestBodyDTO {
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsEnum(CommentTypes)
	type: CommentTypes;
}

export class PostComment_CreateCommentResponseDTO {
	@IsString()
	id: string;
}

export class PostComment_CreateCommentDTO extends DTO {
	public static url = '/posts/:postId/comments';
	public method = HttpMethod.POST;

	public queryDTO: undefined;

    constructor(
		public bodyDTO: PostComment_CreateCommentRequestBodyDTO,
		public paramDTO: PostComment_CreateCommentRequestParamDTO,
		public responseDTO: PostComment_CreateCommentResponseDTO
	) {
		super();
	}
}