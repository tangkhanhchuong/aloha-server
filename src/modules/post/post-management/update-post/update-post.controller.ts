import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Post_UpdatePostDTO,
	Post_UpdatePostRequestBodyDTO,
	Post_UpdatePostResponseDTO
} from 'shared/dto/post/update-post.dto';

import { Post_UpdatePostService } from './update-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class Post_UpdatePostController {
	constructor(
		private readonly logger: Logger,
		private readonly updatePostService: Post_UpdatePostService,
	) {}

	@Patch(Post_UpdatePostDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async updatePost(
		@Param('id') id: string,
		@Body() body: Post_UpdatePostRequestBodyDTO
	): Promise<Post_UpdatePostResponseDTO> {
		try {
			console.log('Hello')
			return await this.updatePostService.execute(id, body);
		} catch (e) {
			this.logger.error(e, e.stack, Post_UpdatePostController.name);
			throw e;
		}
	}
}
