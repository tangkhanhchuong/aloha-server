import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_ForgotPasswordURL,
	Auth_ForgotPasswordRequestDTO
} from 'shared/dto/auth/forgot-password.dto';
import {
	Auth_ResetPasswordURL,
	Auth_ResetPasswordRequestDTO
} from 'shared/dto/auth/reset-password.dto';

import { ForgotPasswordService } from './forgot-password.service';

@Controller()
export class ForgotPasswordController {
	constructor(
		private readonly logger: Logger,
		private readonly forgotPasswordService: ForgotPasswordService
	) {}

	@Post(Auth_ForgotPasswordURL)
	@HttpCode(HttpStatus.OK)
	async forgotPassword(@Body() dto: Auth_ForgotPasswordRequestDTO) {
		try {
			await this.forgotPasswordService.forgotPassword(dto);
		} catch (e) {
			this.logger.error(e, e.stack, ForgotPasswordController.name);
			throw e;
		}
	}

	@Post(Auth_ResetPasswordURL)
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() dto: Auth_ResetPasswordRequestDTO) {
		try {
			await this.forgotPasswordService.resetPassword(dto);
		} catch (e) {
			this.logger.error(e, e.stack, ForgotPasswordController.name);
			throw e;
		}
	}
}
