import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { AuthUser } from 'shared/decorators/auth-user.decorator';

import {
	User_GetUserMediaDTO,
	User_GetUserMediaRequestParamDTO,
	User_GetUserMediaRequestQueryDTO,
	User_GetUserMediaResponseDTO
} from 'shared/dto/user/get-user-media.dto';

import { GetUserMediaService } from './get-user-media.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetUserMediaController {
	constructor(
		private readonly getUserMediaService: GetUserMediaService,
		private readonly logger: Logger,
	) {}

	@Get(User_GetUserMediaDTO.url)
	@UseGuards(CognitoGuard)
	@HttpCode(HttpStatus.OK)
	async getHomeTimeline(
		@AuthUser() authUser: AuthUserPayload,
        @Query() queryDTO: User_GetUserMediaRequestQueryDTO,
        @Param() paramDTO: User_GetUserMediaRequestParamDTO
	): Promise<User_GetUserMediaResponseDTO> {
		try {
			return await this.getUserMediaService.execute(queryDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, GetUserMediaController.name);
			throw e;
		}
	}
}
