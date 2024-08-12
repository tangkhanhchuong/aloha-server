import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	UserRelation_FollowUserRequestDTO,
	UserRelation_FollowUserResponseDTO,
	UserRelation_FollowUserURL
} from 'shared/dto/user-relation/follow-user.dto';

import { FollowUserService } from './follow-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class FollowUserController {
	constructor(
		private readonly logger: Logger,
		private readonly followService: FollowUserService,
	) {}

	@Post(UserRelation_FollowUserURL)
	@HttpCode(HttpStatus.OK)
	async followUser(@Body() body: UserRelation_FollowUserRequestDTO): Promise<UserRelation_FollowUserResponseDTO> {
		try {
			return await this.followService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, FollowUserController.name);
			throw e;
		}
	}
}
