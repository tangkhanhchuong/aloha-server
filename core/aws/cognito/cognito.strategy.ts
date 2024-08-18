import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RedisService } from 'core/redis/redis.service';
import { ConfigService } from 'shared/config/config.service';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService
	) {
		const { cognitoUserPoolId, cognitoClientId, region } = configService.getAWSConfig();
		const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoUserPoolId}`;
		const jwksUri = `${cognitoIssuer}/.well-known/jwks.json`;
		const jwksRequestsPerMinute = 5;
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			audience: cognitoClientId,
			issuer: cognitoIssuer,
			algorithms: ['RS256'],
			secretOrKeyProvider: passportJwtSecret({
				jwksRequestsPerMinute,
				jwksUri,
				cache: true,
				rateLimit: true,
			}),
		});
  }

	async validate(payload: any) {
		const userSession = await this.redisService.getData(payload.sub);
		return {
			cognitoId: payload.sub,
			...userSession
		 };
  }
}
