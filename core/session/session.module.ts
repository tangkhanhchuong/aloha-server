import { Logger, Module } from '@nestjs/common';

import { RedisModule } from 'core/redis/redis.module';

import { SessionService } from './session.service';

@Module({
    imports: [RedisModule],
    providers: [
        SessionService,
        Logger,
    ],
    exports: [
        SessionService,
    ]
})
export class SessionModule {}
