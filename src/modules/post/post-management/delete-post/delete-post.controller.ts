import { Controller, Delete, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	AuthUser,
} from 'shared/decorators/auth-user.decorator';
import {
	Post_DeletePostDTO,
	Post_DeletePostRequestParamDTO,
	Post_DeletePostResponseDTO
} from 'shared/dto/post/delete-post.dto';

import { DeletePostService } from './delete-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class DeletePostController {
	constructor(
		private readonly logger: Logger,
		private readonly deletePostService: DeletePostService,
	) {}

	@Delete(Post_DeletePostDTO.url)
	@UseGuards(CognitoGuard)
	async deletePost(
		@Param() paramDTO: Post_DeletePostRequestParamDTO,
		@AuthUser() authUser: AuthUserPayload
	): Promise<Post_DeletePostResponseDTO> {
		try {
			return await this.deletePostService.execute(paramDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, DeletePostController.name);
			throw e;
		}
	}
}
