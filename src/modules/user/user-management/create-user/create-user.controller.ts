import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	User_CreateUserDTO,
	User_CreateUserRequestBodyDTO,
	User_CreateUserResponseDTO
} from 'shared/dto/user/create-user.dto';

import { CreateUserService } from './create-user.service';

@Controller()
@ApiBearerAuth('access-token')
export class CreateUserController {
	constructor(
		private readonly logger: Logger,
		private readonly createUserService: CreateUserService,
	) {}

	@Post(User_CreateUserDTO.url)
	@UseGuards(CognitoGuard)
	async createUser(@Body() body: User_CreateUserRequestBodyDTO): Promise<User_CreateUserResponseDTO> {
		try {
			return await this.createUserService.execute(body);
		} catch (e) {
			this.logger.error(e, e.stack, CreateUserController.name);
			throw e;
		}
	}
}
