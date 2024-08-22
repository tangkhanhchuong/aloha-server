import { Body, Controller, Logger, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
	AuthUser,
} from 'shared/decorators/auth-user.decorator';
import {
	User_UpdateMyProfileDTO,
	User_UpdateMyProfileRequestBodyDTO,
	User_UpdateMyProfileResponseDTO
} from 'shared/dto/user/update-my-profile.dto';

import { UpdateMyProfileService } from './update-my-profile.service';

@Controller()
@ApiBearerAuth('access-token')
export class UpdateMyProfileController {
	constructor(
		private readonly logger: Logger,
		private readonly updateMyProfileService: UpdateMyProfileService,
	) {}

	@Patch(User_UpdateMyProfileDTO.url)
	@UseGuards(CognitoGuard)
	async updateMyProfile(
		@Body() bodyDTO: User_UpdateMyProfileRequestBodyDTO,
		@AuthUser() authUser: AuthUserPayload
	): Promise<User_UpdateMyProfileResponseDTO> {
		try {
			return await this.updateMyProfileService.execute(bodyDTO, authUser);
		} catch (e) {
			this.logger.error(e, e.stack, UpdateMyProfileController.name);
			throw e;
		}
	}
}
