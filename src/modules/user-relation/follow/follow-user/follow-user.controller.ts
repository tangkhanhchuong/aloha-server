import { Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { AuthUser } from 'shared/decorators/auth-user.decorator';
import {
	UserRelation_FollowUserDTO,
	UserRelation_FollowUserRequestParamDTO,
	UserRelation_FollowUserResponseDTO
} from 'shared/dto/user-relation/follow-user.dto';

import { FollowUserService } from './follow-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class FollowUserController {
	constructor(
		private readonly logger: Logger,
		private readonly followService: FollowUserService,
	) {}

	@Post(UserRelation_FollowUserDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async followUser(
		@Param() paramDTO: UserRelation_FollowUserRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
	): Promise<UserRelation_FollowUserResponseDTO> {
		try {
			return await this.followService.execute(paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, FollowUserController.name);
			throw e;
		}
	}
}
