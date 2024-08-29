import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { AuthUser } from 'shared/decorators/auth-user.decorator';
import {
	Feed_GetUserTimelineDTO,
	Feed_GetUserTimelineRequestParamDTO,
	Feed_GetUserTimelineRequestQueryDTO,
	Feed_GetUserTimelineResponseDTO
} from 'shared/dto/feed/get-user-timeline.dto';

import { GetUserTimelineService } from './get-user-timeline.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetUserTimelineController {
	constructor(
		private readonly getUserTimelineService: GetUserTimelineService,
		private readonly logger: Logger,
	) {}

	@Get(Feed_GetUserTimelineDTO.url)
	@UseGuards(CognitoGuard)
	@HttpCode(HttpStatus.OK)
	async getHomeTimeline(
		@AuthUser() authUser: AuthUserPayload,
        @Query() queryDTO: Feed_GetUserTimelineRequestQueryDTO,
        @Param() paramDTO: Feed_GetUserTimelineRequestParamDTO
	): Promise<Feed_GetUserTimelineResponseDTO> {
		try {
			return await this.getUserTimelineService.execute(queryDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, GetUserTimelineController.name);
			throw e;
		}
	}
}
