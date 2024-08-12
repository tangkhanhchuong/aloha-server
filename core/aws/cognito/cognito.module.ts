import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CognitoService } from './cognito.service';
import { CognitoStrategy } from './cognito.strategy';

@Module({
	providers: [
		CognitoService,
		CognitoStrategy,
		JwtService
	],
	exports: [
		CognitoService,
		CognitoStrategy,
		JwtService
	]
})
export class CognitoModule {}
