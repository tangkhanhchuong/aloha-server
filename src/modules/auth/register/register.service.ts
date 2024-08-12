import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CognitoService } from 'core/aws/cognito/cognito.service';

import { Auth_ConfirmRegistrationRequestDTO } from 'shared/dto/auth/confirm-registration.dto';
import { Auth_RegisterRequestDTO, Auth_RegisterResponseDTO } from 'shared/dto/auth/register.dto';
import { Auth_ResendRegistrationOTPRequestDTO } from 'shared/dto/auth/resend-registration-otp.request.dto';
import { ActivateUserService } from 'src/modules/user/user-management/activate-user/activate-user.service';
import { CreateUserService } from 'src/modules/user/user-management/create-user/create-user.service';
import { FindUsersService } from 'src/modules/user/user-management/find-users/find-users.service';

@Injectable()
export class RegisterService {
	constructor(
		private readonly logger: Logger,
		private readonly cognitoService: CognitoService,
		private readonly createUserService: CreateUserService,
		private readonly activateUserService: ActivateUserService,
		private readonly findUserService: FindUsersService
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
		const usersResponse = await this.findUserService.execute({ email: dto.email });
		const foundUser = usersResponse.users?.[0];
		if (!foundUser) {
			throw new BadRequestException('User not found');
		}
		await this.cognitoService.confirmRegistration(dto.email, dto.otp);
		await this.activateUserService.execute(foundUser.userId);
	}

	async resendRegistration(dto: Auth_ResendRegistrationOTPRequestDTO) {
		return await this.cognitoService.resendRegistrationOTP(dto.email);
	}
}
