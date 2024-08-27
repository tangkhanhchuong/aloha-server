import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Auth_GetUserDTO,
	Auth_GetUserRequestParamDTO,
	Auth_GetUserResponseDTO
} from 'shared/dto/user/get-user.dto';

import { GetUserService } from './get-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class GetUserController {
	constructor(
		private readonly logger: Logger,
		private readonly getUserService: GetUserService,
	) {}

	@Get(Auth_GetUserDTO.url)
	@UseGuards(CognitoGuard)
	async getUser(@Param() paramDTO: Auth_GetUserRequestParamDTO): Promise<Auth_GetUserResponseDTO> {
		try {
			return await this.getUserService.execute(paramDTO);
		} catch (e) {
			this.logger.error(e, e.stack, GetUserController.name);
			throw e;
		}
	}
}
