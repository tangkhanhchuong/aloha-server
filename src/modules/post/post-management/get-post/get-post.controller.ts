import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Post_GetPostDTO,
	Post_GetPostResponseDTO
} from 'shared/dto/post/get-post.dto';

import { GetPostService } from './get-post.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetPostController {
	constructor(
		private readonly getPostService: GetPostService,
		private readonly logger: Logger,
	) {}

	@Get(Post_GetPostDTO.url)
	@UseGuards(CognitoGuard)
	async getPost(@Param('id') id: string): Promise<Post_GetPostResponseDTO> {
		try {
			console.log('Hello')
			return await this.getPostService.execute(id);
		} catch (e) {
			this.logger.error(e, e.stack, GetPostController.name);
			throw e;
		}
	}
}
