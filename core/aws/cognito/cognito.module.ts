import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RedisService } from 'core/redis/redis.service';

import { CognitoService } from './cognito.service';
import { CognitoStrategy } from './cognito.strategy';

@Module({
	providers: [
		CognitoService,
		CognitoStrategy,
		JwtService,
		RedisService
	],
	exports: [
		CognitoService,
		CognitoStrategy,
		JwtService
	]
})
export class CognitoModule {}
