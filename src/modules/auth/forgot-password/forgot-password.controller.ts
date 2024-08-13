import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_ForgotPasswordDTO,
	Auth_ForgotPasswordRequestBodyDTO
} from 'shared/dto/auth/forgot-password.dto';
import {
	Auth_ResetPasswordDTO,
	Auth_ResetPasswordRequestBodyDTO
} from 'shared/dto/auth/reset-password.dto';

import { ForgotPasswordService } from './forgot-password.service';

@Controller()
export class ForgotPasswordController {
	constructor(
		private readonly logger: Logger,
		private readonly forgotPasswordService: ForgotPasswordService
	) {}

	@Post(Auth_ForgotPasswordDTO.url)
	@HttpCode(HttpStatus.OK)
	async forgotPassword(@Body() dto: Auth_ForgotPasswordRequestBodyDTO) {
		try {
			await this.forgotPasswordService.forgotPassword(dto);
		} catch (e) {
			this.logger.error(e, e.stack, ForgotPasswordController.name);
			throw e;
		}
	}

	@Post(Auth_ResetPasswordDTO.url)
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() dto: Auth_ResetPasswordRequestBodyDTO) {
		try {
			await this.forgotPasswordService.resetPassword(dto);
		} catch (e) {
			this.logger.error(e, e.stack, ForgotPasswordController.name);
			throw e;
		}
	}
}
