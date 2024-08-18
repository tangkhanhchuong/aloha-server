import { IsArray, ValidateIf } from 'class-validator';

import { ListingRequestQueryDTO } from 'shared/dto/listing.request.dto';

import { DTO, HttpMethod } from '../base.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';
import { UserDTO } from './user.dto';

export class User_SearchUsersRequestBodyDTO extends ListingRequestQueryDTO {
	@IsArray()
	@ValidateIf((obj) => {
		return !obj.keyword
	})
	userIds?: string[];
}

export class User_SearchUsersResponseDTO extends PaginatedResponseDTO<UserDTO> {};

export class User_SearchUsersDTO extends DTO {
	public static url = '/users/search';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_SearchUsersRequestBodyDTO,
		public responseDTO: User_SearchUsersResponseDTO
	) {
		super();
	}
}
