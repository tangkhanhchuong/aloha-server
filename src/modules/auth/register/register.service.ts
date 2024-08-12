import { Injectable, Logger } from '@nestjs/common';
import { CognitoService } from 'core/aws/cognito/cognito.service';

import { Auth_ConfirmRegistrationRequestDTO } from 'shared/dto/auth/confirm-registration.dto';
import { Auth_RegisterRequestDTO, Auth_RegisterResponseDTO } from 'shared/dto/auth/register.dto';
import { Auth_ResendRegistrationOTPRequestDTO } from 'shared/dto/auth/resend-registration-otp.request.dto';
import { RequestUserService } from 'shared/request/request-user/request-user.service';
import { CreateUserService } from 'src/modules/user/user-management/create-user/create-user.service';

@Injectable()
export class RegisterService {
	constructor(
		private readonly logger: Logger,
		private readonly cognitoService: CognitoService,
		private readonly createUserService: CreateUserService,
	) {}

	async execute(body: Auth_RegisterRequestDTO): Promise<Auth_RegisterResponseDTO> {
		const { email, password } = body;
		const cognitoService = await this.cognitoService.register(email, password);
		this.logger.debug(`OTP Sent::${JSON.stringify(cognitoService.codeDeliveryDetails)}`);
		const saveUser = await this.createUserService.execute(body);
		return {
			id: saveUser.id,
		} as Auth_RegisterResponseDTO;
	}

	async confirmRegistration(dto: Auth_ConfirmRegistrationRequestDTO) {
		return await this.cognitoService.confirmRegistration(dto.email, dto.otp);
	}

	async resendRegistration(dto: Auth_ResendRegistrationOTPRequestDTO) {
		return await this.cognitoService.resendRegistrationOTP(dto.email);
	}
}
