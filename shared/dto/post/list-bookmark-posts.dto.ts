import { ApiProperty } from '@nestjs/swagger';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { PostDTO } from '../post/post.dto';

export class Post_ListBookmarkPostsRequestQueryDTO extends ListingRequestQueryDTO {}

export class  Post_ListBookmarkPostsRequestParamDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

export class Post_ListBookmarkPostsResponseDTO extends PaginatedResponseDTO<PostDTO> {}

export class Post_ListBookmarkPostsDTO extends DTO {
	public static url = '/users/:userId/bookmarks';
	public method = HttpMethod.GET;

	public bodyDTO: undefined;

	constructor(
		public queryDTO: Post_ListBookmarkPostsRequestQueryDTO,
		public paramDTO: Post_ListBookmarkPostsRequestParamDTO,
		public responseDTO: Post_ListBookmarkPostsResponseDTO
	) {
		super();
	}
}
