
import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { CommentDTO } from './comment.dto';

export class PostComment_ListPostCommentRequestParamDTO {
    @IsString()
    postId: string;
}

export class PostComment_ListPostCommentRequestQueryDTO extends ListingRequestQueryDTO {}

export class PostComment_ListPostCommentResponseDTO extends PaginatedResponseDTO<CommentDTO> {}

export class PostComment_ListPostCommentDTO extends DTO {
	public static url = '/posts/:postId/comments';
	public method = HttpMethod.GET;

	public bodyDTO: undefined;

    constructor(
        public paramDTO: PostComment_ListPostCommentRequestParamDTO,
		public queryDTO: PostComment_ListPostCommentRequestQueryDTO,
		public responseDTO: PostComment_ListPostCommentResponseDTO
	) {
		super();
	}
}
