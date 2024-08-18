
import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { PostDTO } from '../post/post.dto';

export class Feed_GetHomeTimelineRequestQueryDTO extends ListingRequestQueryDTO {}

export class Feed_GetHomeTimelineResponseDTO extends PaginatedResponseDTO<PostDTO> {}

export class Feed_GetHomeTimelineDTO extends DTO {
	public static url = '/home/timeline';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: Feed_GetHomeTimelineRequestQueryDTO,
		public responseDTO: Feed_GetHomeTimelineResponseDTO
	) {
		super();
	}
}
