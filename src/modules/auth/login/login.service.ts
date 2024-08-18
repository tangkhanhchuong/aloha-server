import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { RedisService } from 'core/redis/redis.service';
import { User } from 'database/user/user';
import { ConfigService } from 'shared/config/config.service';
import { UserStatuses } from 'shared/constants/user';
import {
	Auth_AutoLoginRequestBodyDTO,
	Auth_AutoLoginResponseDTO
} from 'shared/dto/auth/auto-login.dto';
import {
	Auth_LoginRequestBodyDTO,
	Auth_LoginResponseDTO
} from 'shared/dto/auth/login.dto';

@Injectable()
export class LoginService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly configService: ConfigService,
		private readonly cognitoService: CognitoService,
		private readonly redisService: RedisService
	) {}

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

		const accessToken = authenticatedResult.getIdToken().getJwtToken();
		const refreshToken = authenticatedResult.getRefreshToken().getToken()

		const sessionKey = authenticatedResult.getIdToken().decodePayload().sub;
		await this.redisService.setData(
			sessionKey,
			{
				userId: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                avatar: foundUser.avatar
			},
			parseInt(this.configService.getJwtConfig().expirationTime)
		);

		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
		} as Auth_LoginResponseDTO;
	}

	async autoLogin(dto: Auth_AutoLoginRequestBodyDTO): Promise<Auth_AutoLoginResponseDTO> {
		const accessToken = await this.cognitoService.refreshSession(dto.refreshToken);
		return {
			accessToken,
		} as Auth_AutoLoginResponseDTO;
	}
}
