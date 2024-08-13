import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_ConfirmRegistrationDTO,
	Auth_ConfirmRegistrationRequestBodyDTO
} from 'shared/dto/auth/confirm-registration.dto';
import {
	Auth_RegisterDTO,
	Auth_RegisterRequestBodyDTO,
	Auth_RegisterResponseDTO
} from 'shared/dto/auth/register.dto';
import {
	Auth_ResendRegistrationOtpDTO,
	Auth_ResendRegistrationOTPRequestBodyDTO
} from 'shared/dto/auth/resend-registration-otp.request.dto';

import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
	constructor(
		private readonly logger: Logger,
		private readonly registerService: RegisterService,
	) {}

    @Post(Auth_RegisterDTO.url)
    @HttpCode(HttpStatus.OK)
	async register(@Body() dto: Auth_RegisterRequestBodyDTO): Promise<Auth_RegisterResponseDTO> {
		try {
			return await this.registerService.execute(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}

	@Post(Auth_ConfirmRegistrationDTO.url)
	@HttpCode(HttpStatus.OK)
	async confirmRegistration(@Body() dto: Auth_ConfirmRegistrationRequestBodyDTO) {
		try {
			await this.registerService.confirmRegistration(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}

	@Post(Auth_ResendRegistrationOtpDTO.url)
	@HttpCode(HttpStatus.OK)
	async resendRegistrationOTP(@Body() dto: Auth_ResendRegistrationOTPRequestBodyDTO) {
		try {
			await this.registerService.resendRegistration(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}
}
