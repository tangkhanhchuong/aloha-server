import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Health check')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('health-check')
	@ApiOperation({
		summary: 'Check health',
		description: `
		1. Permissions: 
			- Public
		`,
	})
	checkHealth(): string {
		return this.appService.checkHealth();
	}
}
