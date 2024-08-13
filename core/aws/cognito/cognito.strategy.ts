import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from 'shared/config/config.service';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy) {
  	constructor(configService: ConfigService) {
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
		console.log({ payload })
    	return { userId: payload.sub, email: payload.email };
  }
}
