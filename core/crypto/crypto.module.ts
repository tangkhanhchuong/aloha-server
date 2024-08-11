import { Module } from '@nestjs/common';
import { CryptoInterceptor, CryptoService } from './crypto.interceptor';

@Module({
  imports: [],
  providers: [CryptoInterceptor, CryptoService],
  exports: [CryptoInterceptor, CryptoService],
})
export class CryptoModule {}
