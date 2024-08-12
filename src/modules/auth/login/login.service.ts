import { Injectable } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import {
	Auth_AutoAuthLoginRequestDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginRequestDTO,
	Auth_LoginResponseDTO
} from 'shared/dto/auth/login.dto';

@Injectable()
export class LoginService {
	constructor(
		private readonly cognitoService: CognitoService,
	) {}
	async login(dto: Auth_LoginRequestDTO): Promise<Auth_LoginResponseDTO> {
		const authenticatedResult = await this.cognitoService.authenticate(dto.email, dto.password);
		return {
			accessToken: authenticatedResult.getIdToken().getJwtToken(),
			refreshToken: authenticatedResult.getRefreshToken().getToken(),
		} as Auth_LoginResponseDTO;
	}

	async autoLogin(dto: Auth_AutoAuthLoginRequestDTO): Promise<Auth_AutoLoginResponseDTO> {
		const accessToken = await this.cognitoService.refreshSession(dto.refreshToken);
		return {
			accessToken,
		} as Auth_AutoLoginResponseDTO;
	}
}
