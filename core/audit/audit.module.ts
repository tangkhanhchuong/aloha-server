import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logger.module';
import { AuditInterceptor } from './audit.interceptor';

@Module({
  imports: [LoggerModule],
  providers: [AuditInterceptor],
  exports: [AuditInterceptor],
})
export class AuditModule {}
