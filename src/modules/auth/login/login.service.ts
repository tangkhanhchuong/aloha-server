import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { User } from 'database/user/user';
import { UserStatuses } from 'shared/constants/user';
import {
	Auth_AutoAuthLoginRequestBodyDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginRequestBodyDTO,
	Auth_LoginResponseDTO
} from 'shared/dto/auth/login.dto';

@Injectable()
export class LoginService {
	constructor(
		private readonly cognitoService: CognitoService,
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) { }
	
	async login(bodyDTO: Auth_LoginRequestBodyDTO): Promise<Auth_LoginResponseDTO> {
		const { email, password } = bodyDTO;
		const foundUser = await this.userModel.findOne({
			email: bodyDTO.email
		});
		if (!foundUser) {
			throw new NotFoundException('User not found');
		}
		if (foundUser.status === UserStatuses.INACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

		const authenticatedResult = await this.cognitoService.authenticate(email, password);
		return {
			accessToken: authenticatedResult.getIdToken().getJwtToken(),
			refreshToken: authenticatedResult.getRefreshToken().getToken(),
		} as Auth_LoginResponseDTO;
	}

	async autoLogin(dto: Auth_AutoAuthLoginRequestBodyDTO): Promise<Auth_AutoLoginResponseDTO> {
		const accessToken = await this.cognitoService.refreshSession(dto.refreshToken);
		return {
			accessToken,
		} as Auth_AutoLoginResponseDTO;
	}
}
