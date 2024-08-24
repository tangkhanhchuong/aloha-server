import { Module } from '@nestjs/common';

import { ConfigModule } from '../core/config/config.module';
import { ConfigService } from '../core/config/config.service';

@Module({
	imports: [ConfigModule],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class SharedModule {}
