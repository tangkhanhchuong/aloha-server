import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser, AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
	Auth_GetUserDTO,
	Auth_GetUserResponseDTO
} from 'shared/dto/user/get-user.dto';

import { GetUserService } from './get-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetUserController {
	constructor(
		private readonly logger: Logger,
		private readonly getUserService: GetUserService,
	) {}

	@Get(Auth_GetUserDTO.url)
	@UseGuards(CognitoGuard)
	async getMe(@AuthUser() authUser: AuthUserPayload): Promise<Auth_GetUserResponseDTO> {
		try {
			return await this.getUserService.execute(authUser);
		} catch (e) {
			this.logger.error(e, e.stack, GetUserController.name);
			throw e;
		}
	}
}
