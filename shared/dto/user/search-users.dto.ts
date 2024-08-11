import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateIf } from 'class-validator';

import { ListingRequestDTO } from 'shared/dto/listing.request.dto';

import { PaginatedResponseDTO } from '../paginated.response.dto';

export const User_SearchUsersURL = 'user/search-users';

export class User_SearchUsersRequestDTO extends ListingRequestDTO {
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