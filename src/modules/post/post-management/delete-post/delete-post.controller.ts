import { Controller, Delete, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Post_DeletePostDTO,
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
		@Param('id') id: string,
	): Promise<Post_DeletePostResponseDTO> {
		try {
			console.log('Hello')
			return await this.deletePostService.execute(id);
		} catch (e) {
			this.logger.error(e, e.stack, DeletePostController.name);
			throw e;
		}
	}
}
