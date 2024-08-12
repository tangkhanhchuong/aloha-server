import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_ConfirmRegistrationDTO,
	Auth_ConfirmRegistrationRequestDTO
} from 'shared/dto/auth/confirm-registration.dto';
import {
	Auth_RegisterDTO,
	Auth_RegisterRequestDTO,
	Auth_RegisterResponseDTO
} from 'shared/dto/auth/register.dto';
import {
	Auth_ResendRegistrationOtpDTO,
	Auth_ResendRegistrationOTPRequestDTO
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
	async register(@Body() dto: Auth_RegisterRequestDTO): Promise<Auth_RegisterResponseDTO> {
		try {
			return await this.registerService.execute(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}

	@Post(Auth_ConfirmRegistrationDTO.url)
	@HttpCode(HttpStatus.OK)
	async confirmRegistration(@Body() dto: Auth_ConfirmRegistrationRequestDTO) {
		try {
			await this.registerService.confirmRegistration(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}

	@Post(Auth_ResendRegistrationOtpDTO.url)
	@HttpCode(HttpStatus.OK)
	async resendRegistrationOTP(@Body() dto: Auth_ResendRegistrationOTPRequestDTO) {
		try {
			await this.registerService.resendRegistration(dto);
		} catch (e) {
			this.logger.error(e, e.stack, RegisterController.name);
			throw e;
		}
	}
}
