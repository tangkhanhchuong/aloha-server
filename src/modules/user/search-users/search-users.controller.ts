import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	User_SearchUsersRequestDTO,
	User_SearchUsersResponseDTO,
	User_SearchUsersURL
} from 'shared/dto/user/search-users.dto';

import { SearchUsersService } from './search-users.service';

@Controller()
@ApiBearerAuth('access-token')
export class SearchUsersController {
	constructor(
		private readonly logger: Logger,
		private readonly searchUsersService: SearchUsersService,
	) {}

	@Post(User_SearchUsersURL)
	@HttpCode(HttpStatus.OK)
	async findUsers(@Body() query: User_SearchUsersRequestDTO): Promise<User_SearchUsersResponseDTO> {
		try {
			return await this.searchUsersService.execute(query);
		} catch (e) {
			this.logger.error(e, e.stack, SearchUsersController.name);
			throw e;
		}
	}
}
