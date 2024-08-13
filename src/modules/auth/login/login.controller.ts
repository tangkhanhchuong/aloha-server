import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import {
	Auth_AutoAuthLoginRequestBodyDTO,
	Auth_AutoLoginDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginDTO,
	Auth_LoginRequestBodyDTO,
	Auth_LoginResponseDTO
} from 'shared/dto/auth/login.dto';

import { LoginService } from './login.service';

@Controller()
export class LoginController {
	constructor(
		private readonly logger: Logger,
		private readonly loginService: LoginService
	) {}

	@Post(Auth_LoginDTO.url)
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: Auth_LoginRequestBodyDTO): Promise<Auth_LoginResponseDTO> {
		try {
			return await this.loginService.login(dto);
		} catch (e) {
			this.logger.error(e, e.stack, LoginController.name);
			throw e;
		}
	}

	@Post(Auth_AutoLoginDTO.url)
	@HttpCode(HttpStatus.OK)
	async autoLogin(@Body() dto: Auth_AutoAuthLoginRequestBodyDTO): Promise<Auth_AutoLoginResponseDTO> {
		try {
			return await this.loginService.autoLogin(dto);
		} catch (e) {
			this.logger.error(e, e.stack, LoginController.name);
			throw e;
		}
	}
}
