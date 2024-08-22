import { Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	AuthUser,
} from 'shared/decorators/auth-user.decorator';
import {
	Auth_LogoutDTO,
	Auth_LogoutResponseDTO
} from 'shared/dto/auth/logout.dto';

import { LogoutService } from './logout.service';

@Controller()
export class LogoutController {
	constructor(
		private readonly logger: Logger,
		private readonly logoutService: LogoutService
	) {}

	@Post(Auth_LogoutDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async logout(@AuthUser() authUser: AuthUserPayload): Promise<Auth_LogoutResponseDTO> {
		try {
			return await this.logoutService.execute(authUser);
		} catch (e) {
			this.logger.error(e, e.stack, LogoutController.name);
			throw e;
		}
	}
}
