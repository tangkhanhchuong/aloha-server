import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
    AuthUser,
    AuthUserPayload
} from 'shared/decorators/auth-user.decorator';
import {
    Post_ReactToPostResponseDTO
} from 'shared/dto/post/react-to-post.dto';

import {
    PostComment_CreateCommentDTO,
    PostComment_CreateCommentRequestBodyDTO,
    PostComment_CreateCommentRequestParamDTO,
    PostComment_CreateCommentResponseDTO
} from 'shared/dto/post-comment/create-comment.dto';
import { CreateCommentService } from './create-comment.service';

@Controller()
@ApiBearerAuth('access-token')
export class CreateCommentController {
	constructor(
		private readonly createCommentService: CreateCommentService,
		private readonly logger: Logger,
	) {}

	@Post(PostComment_CreateCommentDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
    async createComment(
		@Body() bodyDTO: PostComment_CreateCommentRequestBodyDTO,
        @Param() paramDTO: PostComment_CreateCommentRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
    ): Promise<PostComment_CreateCommentResponseDTO> {
		try {
			return await this.createCommentService.execute(bodyDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, CreateCommentController.name);
			throw e;
		}
	}
}
