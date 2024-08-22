import { Controller, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { AuthUser } from 'shared/decorators/auth-user.decorator';
import {
	Post_BookmarkPostDTO,
	Post_BookmarkPostRequestParamDTO,
	Post_BookmarkPostResponseDTO
} from 'shared/dto/post/bookmark-post.dto';

import { BookmarkPostService } from './bookmark-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class BookmarkPostController {
	constructor(
		private readonly bookmarkPostService: BookmarkPostService,
		private readonly logger: Logger,
	) {}

	@Post(Post_BookmarkPostDTO.url)
	@UseGuards(CognitoGuard)
	async createPost(
		@AuthUser() authUser: AuthUserPayload,
		@Param() body: Post_BookmarkPostRequestParamDTO
	): Promise<Post_BookmarkPostResponseDTO> {
		try {
			return await this.bookmarkPostService.execute(body, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, BookmarkPostController.name);
			throw e;
		}
	}
}
