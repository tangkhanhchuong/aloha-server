import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	UserRelation_GetFolloweesRequestDTO,
	UserRelation_GetFolloweesResponseDTO,
	UserRelation_GetFolloweesURL
} from 'shared/dto/user-relation/get-followees.dto';

import { GetFolloweesService } from './get-followees.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetFolloweesController {
	constructor(
		private readonly logger: Logger,
		private readonly getFolloweesService: GetFolloweesService,
	) {}

	@Post(UserRelation_GetFolloweesURL)
	@HttpCode(HttpStatus.OK)
	async getFollowees(@Body() body: UserRelation_GetFolloweesRequestDTO): Promise<UserRelation_GetFolloweesResponseDTO> {
		try {
			return await this.getFolloweesService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, GetFolloweesController.name);
			throw e;
		}
	}
}
