
import { ApiProperty } from '@nestjs/swagger';

import { DTO, HttpMedthod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';

export class UserRelation_GetFollowersRequestQueryDTO extends ListingRequestQueryDTO {}
export class UserRelation_UserResponseDTO {
	@ApiProperty({ default: '' })
	userId: string;
}

export class UserRelation_GetFollowersResponseDTO extends PaginatedResponseDTO<UserRelation_UserResponseDTO> {};

export class UserRelation_GetFollowersDTO extends DTO {
	public static url = '/users/:userId/followers';
	public HttpMedthod = HttpMedthod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: UserRelation_GetFollowersRequestQueryDTO,
		public responseDTO: UserRelation_GetFollowersResponseDTO
	) {
		super();
	}
}