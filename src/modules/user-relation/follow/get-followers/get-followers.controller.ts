import { Controller, Get, HttpCode, HttpStatus, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	UserRelation_GetFollowersDTO,
	UserRelation_GetFollowersRequestQueryDTO,
	UserRelation_GetFollowersResponseDTO,
} from 'shared/dto/user-relation/get-followers.dto';

import { GetFollowersService } from './get-followers.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetFollowersController {
	constructor(
		private readonly logger: Logger,
		private readonly getFollowersService: GetFollowersService,
	) {}

	@Get(UserRelation_GetFollowersDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async getFollowers(
		@Query() query: UserRelation_GetFollowersRequestQueryDTO,
		@AuthUser() authUser: AuthUserPayload
	): Promise<UserRelation_GetFollowersResponseDTO> {
		try {
			return await this.getFollowersService.execute(query, authUser.userId);
		} catch (e) {
			this.logger.error(e, e.stack, GetFollowersController.name);
			throw e;
		}
	}
}
