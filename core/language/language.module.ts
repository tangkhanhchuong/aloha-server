import { Module } from '@nestjs/common';
import { LanguageService } from './language.interceptor';

@Module({
  imports: [],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
