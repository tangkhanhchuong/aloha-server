import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CognitoService } from 'core/aws/cognito/cognito.service';
import { User } from 'database/user/user';
import { Auth_ConfirmRegistrationRequestBodyDTO } from 'shared/dto/auth/confirm-registration.dto';
import {
	Auth_RegisterRequestBodyDTO,
	Auth_RegisterResponseDTO
} from 'shared/dto/auth/register.dto';
import { Auth_ResendRegistrationOTPRequestBodyDTO } from 'shared/dto/auth/resend-registration-otp.request.dto';

@Injectable()
export class RegisterService {
	constructor(
		private readonly logger: Logger,
		private readonly cognitoService: CognitoService,
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(bodyDTO: Auth_RegisterRequestBodyDTO): Promise<Auth_RegisterResponseDTO> {
		const { email, password, username } = bodyDTO;

		const foundUser = await this.userModel.findOne({
			email: bodyDTO.email
		});
		if (foundUser) {
			throw new ConflictException('Email existed!');
		}

		const saveUser = await this.userModel.create({
			email,
			username,
			profile: {
				fullname: username
			}
		});
		const cognitoService = await this.cognitoService.register(email, password);
		this.logger.debug(`OTP Sent::${JSON.stringify(cognitoService.codeDeliveryDetails)}`);
		return {
			id: saveUser.id,
		} as Auth_RegisterResponseDTO;
	}

	async confirmRegistration(bodyDTODTO: Auth_ConfirmRegistrationRequestBodyDTO) {
		const { email, otp } = bodyDTODTO;
		const userEntity = await this.userModel.findOne({ email });
		if (!userEntity) {
			throw new BadRequestException('User not found');
		}
		await this.cognitoService.confirmRegistration(email, otp);
		await userEntity.activate();
	}

	async resendRegistration(dto: Auth_ResendRegistrationOTPRequestBodyDTO) {
		return await this.cognitoService.resendRegistrationOTP(dto.email);
	}
}
