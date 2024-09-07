import { ApiProperty } from '@nestjs/swagger';

import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { MediaDTO } from '../media/media.dto';

export class User_GetUserMediaRequestQueryDTO extends ListingRequestQueryDTO {}

export class  User_GetUserMediaRequestParamDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

export class User_GetUserMediaResponseDTO extends PaginatedResponseDTO<MediaDTO> {}

export class User_GetUserMediaDTO extends DTO {
	public static url = '/users/:userId/media';
	public method = HttpMethod.GET;

	public bodyDTO: undefined;

	constructor(
		public queryDTO: User_GetUserMediaRequestQueryDTO,
		public paramDTO: User_GetUserMediaRequestParamDTO,
		public responseDTO: User_GetUserMediaResponseDTO
	) {
		super();
	}
}
