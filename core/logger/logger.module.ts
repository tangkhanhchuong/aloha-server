import { Module } from '@nestjs/common';

import { ContextLogger, LoggerService } from './logger.service';

@Module({
  providers: [ContextLogger, LoggerService],
  exports: [ContextLogger, LoggerService],
})
export class LoggerModule {}
