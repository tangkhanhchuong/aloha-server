import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
    Post_UpdatePostRequestDTO,
    Post_UpdatePostResponseDTO,
    Post_UpdatePostURL
} from 'shared/dto/post/update-post.dto';

import { Post_UpdatePostService } from './update-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class Post_UpdatePostController {
	constructor(
		private readonly logger: Logger,
		private readonly updatePostService: Post_UpdatePostService,
	) {}

	@Post(Post_UpdatePostURL)
	async updatePost(
		@Param('id') id: string,
		@Body() body: Post_UpdatePostRequestDTO
	): Promise<Post_UpdatePostResponseDTO> {
		try {
			return await this.updatePostService.execute(id, body);
		} catch (e) {
			this.logger.error(e, e.stack, Post_UpdatePostController.name);
			throw e;
		}
	}
}
