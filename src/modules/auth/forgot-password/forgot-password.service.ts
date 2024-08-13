import { Injectable } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { Auth_ForgotPasswordRequestBodyDTO } from 'shared/dto/auth/forgot-password.dto';
import { Auth_ResetPasswordRequestBodyDTO } from 'shared/dto/auth/reset-password.dto';

@Injectable()
export class ForgotPasswordService {
	constructor(
		private readonly cognitoService: CognitoService,
	) {}
	async forgotPassword(dto: Auth_ForgotPasswordRequestBodyDTO) {
		await this.cognitoService.forgotPassword(dto.email);
	}

	async resetPassword(dto: Auth_ResetPasswordRequestBodyDTO) {
		await this.cognitoService.resetPassword(dto.email, dto.verificationCode, dto.newPassword);
	}
}
