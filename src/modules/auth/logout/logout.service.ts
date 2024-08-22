import { Injectable } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { RedisService } from 'core/redis/redis.service';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { Auth_LogoutResponseDTO } from 'shared/dto/auth/logout.dto';

@Injectable()
export class LogoutService {
	constructor(
		private readonly cognitoService: CognitoService,
		private	readonly redisService: RedisService
	) {}

	async execute(authUser: AuthUserPayload): Promise<Auth_LogoutResponseDTO> {
		const { email, cognitoId } = authUser;

		await this.cognitoService.logout(email);
		await this.redisService.removeData(cognitoId);
		return {
			status: true
		} as Auth_LogoutResponseDTO;
	}
}
