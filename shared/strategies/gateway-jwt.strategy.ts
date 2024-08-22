import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class GatewayJwtStrategy extends PassportStrategy(Strategy, 'gateway-jwt') {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: (req) => {
				return req.headers?.gatewaytoken?.split('Bearer ')[1] || null;
			},
			ignoreExpiration: true,
			secretOrKey: configService.getJwtConfig().secret,
		});
	}

	async validate(payload: any) {
		if (payload.serviceName !== 'AUTH') {
			throw new BadRequestException('Request is not from API gateway');
		}
		return { serviceName: payload.serviceName };
	}
}
