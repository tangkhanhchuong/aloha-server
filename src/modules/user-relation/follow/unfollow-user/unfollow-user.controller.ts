import { Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	UserRelation_UnfollowUserDTO,
	UserRelation_UnfollowUserResponseDTO
} from 'shared/dto/user-relation/unfollow-user.dto';

import { UnfollowUserService } from './unfollow-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class UnfollowUserController {
	constructor(
		private readonly logger: Logger,
		private readonly unfollowUserService: UnfollowUserService,
	) {}

	@Post(UserRelation_UnfollowUserDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async unfollowUser(
		@Param('userId') userId: string,
		@AuthUser() authUser: AuthUserPayload
	): Promise<UserRelation_UnfollowUserResponseDTO> {
		try {
			return await this.unfollowUserService.execute(authUser.userId, userId);
		} catch (e) {
			this.logger.error(e, e.stack, UnfollowUserController.name);
			throw e;
		}
	}
}
