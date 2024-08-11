import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';


import { UserSettingsService } from './user-settings.service';

@Controller()
@ApiBearerAuth('access-token')
export class UserSettingsController {
	constructor(
		private readonly userSettingsService: UserSettingsService,
	) {}
}
