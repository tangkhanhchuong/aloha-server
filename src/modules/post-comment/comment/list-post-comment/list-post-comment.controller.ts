import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	AuthUser,
} from 'shared/decorators/auth-user.decorator';
import {
	PostComment_ListPostCommentDTO,
	PostComment_ListPostCommentRequestParamDTO,
	PostComment_ListPostCommentRequestQueryDTO,
	PostComment_ListPostCommentResponseDTO
} from 'shared/dto/post-comment/list-post-comment.dto';

import { ListPostCommentService } from './list-post-comment.service';

@Controller()
@ApiBearerAuth('access-token')
export class ListPostCommentController {
	constructor(
		private readonly listPostCommentService: ListPostCommentService,
		private readonly logger: Logger,
	) {}

	@Get(PostComment_ListPostCommentDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async listPostComment(
		@Query() queryDTO: PostComment_ListPostCommentRequestQueryDTO, 
        @Param() paramDTO: PostComment_ListPostCommentRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
    ): Promise<PostComment_ListPostCommentResponseDTO> {
		try {
			return await this.listPostCommentService.execute(paramDTO, queryDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, ListPostCommentController.name);
			throw e;
		}
	}
}
