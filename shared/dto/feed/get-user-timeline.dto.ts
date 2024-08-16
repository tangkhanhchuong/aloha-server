import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';

export class Feed_GetUserTimelineRequestQueryDTO extends ListingRequestQueryDTO {}

export class  Feed_GetUserTimelineRequestParamDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

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

export class Feed_Feed_GetUserTimelineResponseDTO extends PaginatedResponseDTO<Feed_PostItemResponseDTO> {}

export class Feed_Feed_GetUserTimelineDTO extends DTO {
	public static url = '/users/:userId/timeline';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: Feed_GetUserTimelineRequestQueryDTO,
		public responseDTO: Feed_Feed_GetUserTimelineResponseDTO
	) {
		super();
	}
}
