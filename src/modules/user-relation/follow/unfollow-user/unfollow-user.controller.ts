import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	UserRelation_UnfollowUserRequestDTO,
	UserRelation_UnfollowUserResponseDTO,
	UserRelation_UnfollowUserURL
} from 'shared/dto/user-relation/unfollow-user.dto';

import { UnfollowUserService } from './unfollow-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class UnfollowUserController {
	constructor(
		private readonly logger: Logger,
		private readonly unfollowUserService: UnfollowUserService,
	) {}

	@Post(UserRelation_UnfollowUserURL)
	@HttpCode(HttpStatus.OK)
	async unfollowUser(@Body() body: UserRelation_UnfollowUserRequestDTO): Promise<UserRelation_UnfollowUserResponseDTO> {
		try {
			return await this.unfollowUserService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, UnfollowUserController.name);
			throw e;
		}
	}
}
