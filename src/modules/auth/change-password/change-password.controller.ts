import { Body, Controller, HttpCode, HttpStatus, Logger, Put, UseGuards } from '@nestjs/common';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUser } from 'shared/decorators/auth-user.decorator';
import {
	Auth_ChangePasswordDTO,
	Auth_ChangePasswordRequestDTO
} from 'shared/dto/auth/change-password.dto';

import { ChangePasswordService } from './change-password.service';

@Controller()
export class ChangePasswordController {
	constructor(
		private readonly logger: Logger,
		private readonly changePasswordService: ChangePasswordService
	) {}

	@Put(Auth_ChangePasswordDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async changePassword(@Body() dto: Auth_ChangePasswordRequestDTO, @AuthUser() user) {
		try {
			dto.email = user.email;
			await this.changePasswordService.execute(user.email, dto);
		} catch (e) {
			this.logger.error(e, e.stack, ChangePasswordController.name);
			throw e;
		}
	}
}
