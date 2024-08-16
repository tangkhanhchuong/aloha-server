import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';

export class Feed_GetHomeTimelineRequestQueryDTO extends ListingRequestQueryDTO {}

export class  Feed_PostItemResponseDTO {
	@ApiProperty({ default: '' })
	postId: string;

	@ApiProperty({ default: '' })
	authorId: string;

	@ApiProperty({ default: '' })
	content: string;

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	fileUrls: string[];

	@ApiProperty({ default: '' })
	numberOfReactions: string;

	@ApiProperty({ default: '' })
	numberOfComments: string;

	@ApiProperty({ default: '' })
	createdAt: string;

	@ApiProperty({ default: '' })
	createdBy: string;
}

export class Feed_GetHomeTimelineResponseDTO extends PaginatedResponseDTO<Feed_PostItemResponseDTO> {}

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
