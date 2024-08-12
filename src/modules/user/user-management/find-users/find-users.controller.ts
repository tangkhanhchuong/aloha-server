import { Controller, Logger, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	User_FindUsersDTO,
	User_FindUsersRequestDTO,
	User_FindUsersResponseDTO
} from 'shared/dto/user/find-users.dto';

import { FindUsersService } from './find-users.service';

@Controller()
@ApiBearerAuth('access-token')
export class FindUsersController {
	constructor(
		private readonly logger: Logger,
		private readonly findUsersService: FindUsersService,
	) {}

	@Post(User_FindUsersDTO.url)
	async findUsers(@Query() query: User_FindUsersRequestDTO): Promise<User_FindUsersResponseDTO> {
		try {
			return await this.findUsersService.execute(query);
		} catch (e) {
			this.logger.error(e, e.stack, FindUsersController.name);
			throw e;
		}
	}
}
