import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SessionModule } from 'core/session/session.module';

import { CognitoService } from './cognito.service';
import { CognitoStrategy } from './cognito.strategy';

@Module({
	imports: [SessionModule],
	providers: [
		CognitoService,
		CognitoStrategy,
		JwtService,
	],
	exports: [
		CognitoService,
		CognitoStrategy,
		JwtService
	]
})
export class CognitoModule {}
