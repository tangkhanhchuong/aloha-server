import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
	UserRelation_IntializeUserRelationRequestDTO,
	UserRelation_IntializeUserRelationResponseDTO,
	UserRelation_IntializeUserRelationURL
} from 'shared/dto/user-relation/initialize-user-relation.dto';

import { InitializeUserRelationService } from './initialize-user-relation.service';

@Controller()
@ApiBearerAuth('access-token')
export class InitializeUserRelationController {
	constructor(
		private readonly logger: Logger,
		private readonly initializeUserRelationService: InitializeUserRelationService,
	) {}

	@Post(UserRelation_IntializeUserRelationURL)
	async Follow(@Body() body: UserRelation_IntializeUserRelationRequestDTO): Promise<UserRelation_IntializeUserRelationResponseDTO> {
		try {
			return await this.initializeUserRelationService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, InitializeUserRelationController.name);
			throw e;
		}
	}
}
