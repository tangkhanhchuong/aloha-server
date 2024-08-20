import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Auth_GetMeDTO,
	Auth_GetMeResponseDTO
} from 'shared/dto/auth/get-me.dto';

import { GetMeService } from './get-me.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetMeController {
	constructor(
		private readonly logger: Logger,
		private readonly getMeService: GetMeService,
	) {}

	@Get(Auth_GetMeDTO.url)
	@UseGuards(CognitoGuard)
	async getMe(@AuthUser() authUser: AuthUserPayload): Promise<Auth_GetMeResponseDTO> {
		try {
			return await this.getMeService.execute(authUser);
		} catch (e) {
			this.logger.error(e, e.stack, GetMeController.name);
			throw e;
		}
	}
}
