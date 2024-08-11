import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
@Module({
	imports: [ConfigModule],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class SharedModule {}
