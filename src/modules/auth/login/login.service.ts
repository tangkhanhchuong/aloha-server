import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { UserStatus } from 'shared/constants/user';
import {
	Auth_AutoAuthLoginRequestDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginRequestDTO,
	Auth_LoginResponseDTO
} from 'shared/dto/auth/login.dto';
import { FindUsersService } from 'src/modules/user/user-management/find-users/find-users.service';

@Injectable()
export class LoginService {
	constructor(
		private readonly cognitoService: CognitoService,
		private readonly findUsersService: FindUsersService
	) {}
	async login(dto: Auth_LoginRequestDTO): Promise<Auth_LoginResponseDTO> {
		const users = await this.findUsersService.execute({
			email: dto.email
		});
		const foundUser = users.users?.[0];
		if (!foundUser) {
			throw new NotFoundException('User not found');
		}
		if (foundUser.status === UserStatus.INACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

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
