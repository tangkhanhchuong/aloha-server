import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { UserDTO } from '../user/user.dto';

export class UserRelation_GetFollowersRequestQueryDTO extends ListingRequestQueryDTO { }

export class UserRelation_GetFollowersResponseDTO extends PaginatedResponseDTO<UserDTO> {};

export class UserRelation_GetFollowersDTO extends DTO {
	public static url = '/users/:userId/followers';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public queryDTO: UserRelation_GetFollowersRequestQueryDTO,
		public responseDTO: UserRelation_GetFollowersResponseDTO
	) {
		super();
	}
}