import { ApiProperty } from '@nestjs/swagger';

import { DTO, HttpMedthod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';

export class UserRelation_GetFolloweesRequestQueryDTO extends ListingRequestQueryDTO {}

export class UserRelation_UserResponseDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

export class UserRelation_GetFolloweesResponseDTO extends PaginatedResponseDTO<UserRelation_UserResponseDTO> {};

export class UserRelation_GetFolloweesDTO extends DTO {
	public static url = '/users/:userId/followees';
	public HttpMedthod = HttpMedthod.GET;

	public bodyDTO: undefined;
	public paramDTO: undefined;
	
	constructor(
		public queryDTO: UserRelation_GetFolloweesRequestQueryDTO,
		public responseDTO: UserRelation_GetFolloweesResponseDTO
	) {
		super();
	}
}