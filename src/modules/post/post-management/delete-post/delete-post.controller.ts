import { Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	Post_DeletePostResponseDTO,
	Post_DeletePostURL
} from 'shared/dto/post/delete-post.dto';

import { DeletePostService } from './delete-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class DeletePostController {
	constructor(
		private readonly logger: Logger,
		private readonly deletePostService: DeletePostService,
	) {}

	@Post(Post_DeletePostURL)
	async DeletePost(
		@Param('id') id: string,
	): Promise<Post_DeletePostResponseDTO> {
		try {
			return await this.deletePostService.execute(id);
		} catch (e) {
			this.logger.error(e, e.stack, DeletePostController.name);
			throw e;
		}
	}
}
