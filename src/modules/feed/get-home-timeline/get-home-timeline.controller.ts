import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Feed_GetHomeTimelineDTO,
	Feed_GetHomeTimelineRequestQueryDTO,
	Feed_GetHomeTimelineResponseDTO
} from 'shared/dto/feed/get-home-timeline.dto';

import { GetHomeTimelineService } from './get-home-timeline.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetHomeTimelineController {
	constructor(
		private readonly getHomeTimelineService: GetHomeTimelineService,
		private readonly logger: Logger,
	) {}

	@Get(Feed_GetHomeTimelineDTO.url)
	@UseGuards(CognitoGuard)
	async getHomeTimeline(
		@AuthUser() authUser: AuthUserPayload,
		@Query() queryDTO: Feed_GetHomeTimelineRequestQueryDTO
	): Promise<Feed_GetHomeTimelineResponseDTO> {
		try {
			return await this.getHomeTimelineService.execute(queryDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, Feed_GetHomeTimelineDTO.name);
			throw e;
		}
	}
}
