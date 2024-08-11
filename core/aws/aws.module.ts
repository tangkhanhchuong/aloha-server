import { Module } from '@nestjs/common';

import { CognitoService } from './cognito/cognito.service';

@Module({
	providers: [CognitoService],
	exports: [CognitoService],
})
export class AWSModule {}
