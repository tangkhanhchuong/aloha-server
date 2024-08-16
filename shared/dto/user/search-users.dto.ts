import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateIf } from 'class-validator';

import { ListingRequestQueryDTO } from 'shared/dto/listing.request.dto';

import { DTO, HttpMedthod } from '../base.dto';
import { PaginatedResponseDTO } from '../paginated.response.dto';

export class User_SearchUsersRequestBodyDTO extends ListingRequestQueryDTO {
	@ApiProperty({ default: '' })
	@IsArray()
	@ValidateIf((obj) => {
		return !obj.keyword
	})
	userIds?: string[];
}

export class User_UserResponseDTO {
	@ApiProperty({ default: 'example' })
	username: string;

	@ApiProperty({ default: 'example@gmail.com' })
	email: string;

	@ApiProperty({ default: 'https://avatar.png' })
	avatar: string;
}

export class User_SearchUsersResponseDTO extends PaginatedResponseDTO<User_UserResponseDTO> {};

export class User_SearchUsersDTO extends DTO {
	public static url = '/users/search';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_SearchUsersRequestBodyDTO,
		public responseDTO: User_SearchUsersResponseDTO
	) {
		super();
	}
}
