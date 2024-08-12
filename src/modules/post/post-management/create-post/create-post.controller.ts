import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Post_CreatePostDTO,
	Post_CreatePostRequestDTO,
	Post_CreatePostResponseDTO
} from 'shared/dto/post/create-post.dto';

import { CreatePostService } from './create-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class CreatePostController {
	constructor(
		private readonly createPostService: CreatePostService,
		private readonly logger: Logger,
	) {}

	@Post(Post_CreatePostDTO.url)
	@UseGuards(CognitoGuard)
	async createPost(@Body() body: Post_CreatePostRequestDTO): Promise<Post_CreatePostResponseDTO> {
		try {
			return await this.createPostService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, CreatePostController.name);
			throw e;
		}
	}
}
