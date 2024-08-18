import { ApiProperty } from '@nestjs/swagger';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { PostDTO } from '../post/post.dto';

export class Feed_GetUserTimelineRequestQueryDTO extends ListingRequestQueryDTO {}

export class  Feed_GetUserTimelineRequestParamDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

export class Feed_Feed_GetUserTimelineResponseDTO extends PaginatedResponseDTO<PostDTO> {}

export class Feed_Feed_GetUserTimelineDTO extends DTO {
	public static url = '/users/:userId/timeline';
	public method = HttpMethod.GET;

	public bodyDTO: undefined;

	constructor(
		public queryDTO: Feed_GetUserTimelineRequestQueryDTO,
		public paramDTO: Feed_GetUserTimelineRequestParamDTO,
		public responseDTO: Feed_Feed_GetUserTimelineResponseDTO
	) {
		super();
	}
}
