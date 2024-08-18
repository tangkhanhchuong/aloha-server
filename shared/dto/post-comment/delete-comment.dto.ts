import { IsBoolean, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class PostComment_DeleteCommentRequestParamDTO {
	@IsString()
	commentId: string;
}

export class PostComment_DeleteCommentResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class PostComment_DeleteCommentDTO extends DTO {
	public static url = '/comments/:commentId';
	public method = HttpMethod.DELETE;

	public queryDTO: undefined;
	public bodyDTO: undefined;

    constructor(
		public paramDTO: PostComment_DeleteCommentRequestParamDTO,
		public responseDTO: PostComment_DeleteCommentResponseDTO
	) {
		super();
	}
}