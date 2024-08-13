import { Injectable } from '@nestjs/common';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { Auth_ChangePasswordRequestBodyDTO } from 'shared/dto/auth/change-password.dto';

@Injectable()
export class ChangePasswordService {
	constructor(
		private readonly cognitoService: CognitoService,
	) {}
	async execute(email: string, dto: Auth_ChangePasswordRequestBodyDTO) {
		await this.cognitoService.changePassword(email, dto.oldPassword, dto.newPassword);
	}
}
