import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
    Feed_Feed_GetUserTimelineDTO,
    Feed_GetUserTimelineRequestParamDTO,
    Feed_GetUserTimelineRequestQueryDTO,
    Feed_Feed_GetUserTimelineResponseDTO
} from 'shared/dto/feed/get-user-timeline.dto';

import { GetUserTimelineService } from './get-user-timeline.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetUserTimelineController {
	constructor(
		private readonly getUserTimelineService: GetUserTimelineService,
		private readonly logger: Logger,
	) {}

	@Get(Feed_Feed_GetUserTimelineDTO.url)
	@UseGuards(CognitoGuard)
	async getHomeTimeline(
		@AuthUser() authUser: AuthUserPayload,
        @Query() queryDTO: Feed_GetUserTimelineRequestQueryDTO,
        @Param() paramDTO: Feed_GetUserTimelineRequestParamDTO
	): Promise<Feed_Feed_GetUserTimelineResponseDTO> {
		try {
			return await this.getUserTimelineService.execute(queryDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, GetUserTimelineController.name);
			throw e;
		}
	}
}
