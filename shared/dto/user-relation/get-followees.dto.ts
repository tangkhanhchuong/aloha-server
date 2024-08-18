import { DTO, HttpMethod } from '../base.dto';
import { ListingRequestQueryDTO } from '../listing.request.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { UserDTO } from '../user/user.dto';

export class UserRelation_GetFolloweesRequestQueryDTO extends ListingRequestQueryDTO {}

export class UserRelation_GetFolloweesResponseDTO extends PaginatedResponseDTO<UserDTO> {};

export class UserRelation_GetFolloweesDTO extends DTO {
	public static url = '/users/:userId/followees';
	public method = HttpMethod.GET;

	public bodyDTO: undefined;
	public paramDTO: undefined;
	
	constructor(
		public queryDTO: UserRelation_GetFolloweesRequestQueryDTO,
		public responseDTO: UserRelation_GetFolloweesResponseDTO
	) {
		super();
	}
}