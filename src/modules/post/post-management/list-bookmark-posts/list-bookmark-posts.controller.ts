import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { AuthUser } from 'shared/decorators/auth-user.decorator';
import {
    Post_ListBookmarkPostsDTO,
    Post_ListBookmarkPostsRequestParamDTO,
    Post_ListBookmarkPostsRequestQueryDTO,
    Post_ListBookmarkPostsResponseDTO
} from 'shared/dto/post/list-bookmark-posts.dto';

import { ListBookmarkPostsService } from './list-bookmark-posts.service';

@Controller()
@ApiBearerAuth('access-token')
export class ListBookmarkPostsController {
	constructor(
		private readonly listBookmarkPostsService: ListBookmarkPostsService,
		private readonly logger: Logger,
	) {}

	@Get(Post_ListBookmarkPostsDTO.url)
	@UseGuards(CognitoGuard)
	async getHomeTimeline(
		@AuthUser() authUser: AuthUserPayload,
        @Query() queryDTO: Post_ListBookmarkPostsRequestQueryDTO,
        @Param() paramDTO: Post_ListBookmarkPostsRequestParamDTO
	): Promise<Post_ListBookmarkPostsResponseDTO> {
		try {
			return await this.listBookmarkPostsService.execute(queryDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, ListBookmarkPostsController.name);
			throw e;
		}
	}
}
