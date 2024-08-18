import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	AuthUser,
	AuthUserPayload
} from 'shared/decorators/auth-user.decorator';
import {
	PostComment_UpdateCommentDTO,
	PostComment_UpdateCommentRequestBodyDTO,
	PostComment_UpdateCommentRequestParamDTO,
	PostComment_UpdateCommentResponseDTO
} from 'shared/dto/post-comment/update-comment.dto';

import { UpdateCommentService } from './update-comment.service';

@Controller()
@ApiBearerAuth('access-token')
export class UpdateCommentController {
	constructor(
		private readonly updateCommentService: UpdateCommentService,
		private readonly logger: Logger,
	) {}

	@Post(PostComment_UpdateCommentDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async updateComment(
		@Body() bodyDTO: PostComment_UpdateCommentRequestBodyDTO,
        @Param() paramDTO: PostComment_UpdateCommentRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
    ): Promise<PostComment_UpdateCommentResponseDTO> {
		try {
			return await this.updateCommentService.execute(bodyDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, UpdateCommentController.name);
			throw e;
		}
	}
}
