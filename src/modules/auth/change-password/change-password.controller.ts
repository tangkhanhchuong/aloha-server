import { Body, Controller, HttpCode, HttpStatus, Logger, Put, UseGuards } from '@nestjs/common';

import { GatewayAuthUser } from 'shared/decorators/gateway-auth-user.decorator';
import {
	Auth_ChangePasswordURL,
	Auth_ChangePasswordRequestDTO
} from 'shared/dto/auth/change-password.dto';

import { ChangePasswordService } from './change-password.service';

@Controller()
export class ChangePasswordController {
	constructor(
		private readonly logger: Logger,
		private readonly changePasswordService: ChangePasswordService
	) {}

	@Put(Auth_ChangePasswordURL)
	@HttpCode(HttpStatus.OK)
	async execute(@Body() dto: Auth_ChangePasswordRequestDTO, @GatewayAuthUser() user) {
		try {
			dto.email = user.email;
			await this.changePasswordService.execute(user.email, dto);
		} catch (e) {
			this.logger.error(e, e.stack, ChangePasswordController.name);
			throw e;
		}
	}
}
