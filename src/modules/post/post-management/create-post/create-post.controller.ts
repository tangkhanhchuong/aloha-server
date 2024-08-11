import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
    Post_PostCreatePostRequestDTO,
    Post_PostCreatePostResponseDTO,
    Post_PostCreatePostURL
} from 'shared/dto/post/create-post.dto';

import { CreatePostService } from './create-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class CreatePostController {
	constructor(
		private readonly createPostService: CreatePostService,
		private readonly logger: Logger,
	) {}

	@Post(Post_PostCreatePostURL)
	async createPost(@Body() body: Post_PostCreatePostRequestDTO): Promise<Post_PostCreatePostResponseDTO> {
		try {
			return await this.createPostService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, CreatePostController.name);
			throw e;
		}
	}
}
