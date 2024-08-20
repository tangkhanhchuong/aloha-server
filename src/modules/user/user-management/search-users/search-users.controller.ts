import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	User_SearchUsersDTO,
	User_SearchUsersRequestBodyDTO,
	User_SearchUsersResponseDTO
} from 'shared/dto/user/search-users.dto';

import { SearchUsersService } from './search-users.service';

@Controller()
@ApiBearerAuth('access-token')
export class SearchUsersController {
	constructor(
		private readonly logger: Logger,
		private readonly searchUsersService: SearchUsersService,
	) {}

	@Post(User_SearchUsersDTO.url)
	@UseGuards(CognitoGuard)
	@HttpCode(HttpStatus.OK)
	async findUsers(@Body() body: User_SearchUsersRequestBodyDTO): Promise<User_SearchUsersResponseDTO> {
		try {
			return await this.searchUsersService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, SearchUsersController.name);
			throw e;
		}
	}
}
