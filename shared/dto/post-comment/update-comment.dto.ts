import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class PostComment_UpdateCommentRequestParamDTO {
	@IsString()
	commentId: string;
}

export class PostComment_UpdateCommentRequestBodyDTO {
	@IsString()
	content: string;
}

export class PostComment_UpdateCommentResponseDTO {
	@IsString()
	id: string;
}

export class PostComment_UpdateCommentDTO extends DTO {
	public static url = '/comments/:commentId';
	public method = HttpMethod.PATCH;

	public queryDTO: undefined;
	public bodyDTO: undefined;

    constructor(
		public paramDTO: PostComment_UpdateCommentRequestParamDTO,
		public responseDTO: PostComment_UpdateCommentResponseDTO
	) {
		super();
	}
}