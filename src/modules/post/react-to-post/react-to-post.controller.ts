import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	AuthUser,
} from 'shared/decorators/auth-user.decorator';
import {
	Post_ReactToPostDTO,
	Post_ReactToPostRequestBodyDTO,
	Post_ReactToPostRequestParamDTO,
	Post_ReactToPostResponseDTO
} from 'shared/dto/post/react-to-post.dto';

import { ReactToPostService } from './react-to-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class ReactToPostController {
	constructor(
		private readonly reactToPostService: ReactToPostService,
		private readonly logger: Logger,
	) {}

	@Post(Post_ReactToPostDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
    async reactToPost(
		@Body() bodyDTO: Post_ReactToPostRequestBodyDTO,
        @Param() paramDTO: Post_ReactToPostRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
    ): Promise<Post_ReactToPostResponseDTO> {
		try {
			return await this.reactToPostService.execute(bodyDTO, paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, ReactToPostController.name);
			throw e;
		}
	}
}
