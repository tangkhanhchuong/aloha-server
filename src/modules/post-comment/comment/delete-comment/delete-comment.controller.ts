import { Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	AuthUser,
	AuthUserPayload
} from 'shared/decorators/auth-user.decorator';
import {
	PostComment_DeleteCommentDTO,
	PostComment_DeleteCommentRequestParamDTO,
	PostComment_DeleteCommentResponseDTO
} from 'shared/dto/post-comment/delete-comment.dto';

import { DeleteCommentService } from './delete-comment.service';

@Controller()
@ApiBearerAuth('access-token')
export class DeleteCommentController {
	constructor(
		private readonly deleteCommentService: DeleteCommentService,
		private readonly logger: Logger,
	) {}

	@Post(PostComment_DeleteCommentDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
    async deleteComment(
        @Param() paramDTO: PostComment_DeleteCommentRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
    ): Promise<PostComment_DeleteCommentResponseDTO> {
		try {
			return await this.deleteCommentService.execute(paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, DeleteCommentController.name);
			throw e;
		}
	}
}
