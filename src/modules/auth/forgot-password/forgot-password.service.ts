import { Injectable } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { Auth_ForgotPasswordRequestDTO } from 'shared/dto/auth/forgot-password.dto';
import { Auth_ResetPasswordRequestDTO } from 'shared/dto/auth/reset-password.dto';

@Injectable()
export class ForgotPasswordService {
	constructor(
		private readonly cognitoService: CognitoService,
	) {}
	async forgotPassword(dto: Auth_ForgotPasswordRequestDTO) {
		await this.cognitoService.forgotPassword(dto.email);
	}

	async resetPassword(dto: Auth_ResetPasswordRequestDTO) {
		await this.cognitoService.resetPassword(dto.email, dto.verificationCode, dto.newPassword);
	}
}
