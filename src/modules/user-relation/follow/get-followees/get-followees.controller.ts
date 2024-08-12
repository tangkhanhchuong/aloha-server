import { Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	UserRelation_GetFolloweesDTO,
	UserRelation_GetFolloweesResponseDTO,
} from 'shared/dto/user-relation/get-followees.dto';

import { GetFolloweesService } from './get-followees.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetFolloweesController {
	constructor(
		private readonly logger: Logger,
		private readonly getFolloweesService: GetFolloweesService,
	) {}

	@Post(UserRelation_GetFolloweesDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async getFollowees(@AuthUser() authUser: AuthUserPayload): Promise<UserRelation_GetFolloweesResponseDTO> {
		try {
			return await this.getFolloweesService.execute(authUser.userId);
		} catch (e) {
			this.logger.error(e, e.stack, GetFolloweesController.name);
			throw e;
		}
	}
}
