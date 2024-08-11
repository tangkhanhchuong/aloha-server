import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	Post_GetPostURL,
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

	@Get(Post_GetPostURL)
	async getPost(@Param('id') id: string): Promise<Post_GetPostResponseDTO> {
		try {
			return await this.getPostService.execute(id);
		} catch (e) {
			this.logger.error(e, e.stack, GetPostController.name);
			throw e;
		}
	}
}
