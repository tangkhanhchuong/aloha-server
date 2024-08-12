import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	UserRelation_GetFollowersRequestDTO,
	UserRelation_GetFollowersResponseDTO,
	UserRelation_GetFollowersURL
} from 'shared/dto/user-relation/get-followers.dto';

import { GetFollowersService } from './get-followers.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetFollowersController {
	constructor(
		private readonly logger: Logger,
		private readonly getFollowersService: GetFollowersService,
	) {}

	@Post(UserRelation_GetFollowersURL)
	@HttpCode(HttpStatus.OK)
	async getFollowers(@Body() body: UserRelation_GetFollowersRequestDTO): Promise<UserRelation_GetFollowersResponseDTO> {
		try {
			return await this.getFollowersService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, GetFollowersController.name);
			throw e;
		}
	}
}
