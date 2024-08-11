import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_AutoLoginURL,
	Auth_AutoAuthLoginRequestDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginURL,
	Auth_LoginRequestDTO,
	AuthLoginResponseDTO
} from 'shared/dto/auth/login.dto';

import { LoginService } from './login.service';

@Controller()
export class LoginController {
	constructor(
		private readonly logger: Logger,
		private readonly loginService: LoginService
	) {}

	@Post(Auth_LoginURL)
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: Auth_LoginRequestDTO): Promise<AuthLoginResponseDTO> {
		try {
			return await this.loginService.login(dto);
		} catch (e) {
			this.logger.error(e, e.stack, LoginController.name);
			throw e;
		}
	}

	@Post(Auth_AutoLoginURL)
	@HttpCode(HttpStatus.OK)
	async autoLogin(@Body() dto: Auth_AutoAuthLoginRequestDTO): Promise<Auth_AutoLoginResponseDTO> {
		try {
			return await this.loginService.autoLogin(dto);
		} catch (e) {
			this.logger.error(e, e.stack, LoginController.name);
			throw e;
		}
	}
}
