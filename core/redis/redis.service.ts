import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

import { ConfigService } from 'core/config/config.service';

@Injectable()
export class RedisService {
    private readonly redisClient: RedisClient;
    
    constructor(
        private readonly configService: ConfigService
    ) {
        const redisConfig = this.configService.getRedisConfig();
        this.redisClient = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
        });
    }

    async setData(key: string, value: string, expiredInSeconds?: number): Promise<void> {
        await this.redisClient.set(
            key,
            value,
            'EX',
            expiredInSeconds
        );
    }

    async getData(key: string): Promise<string> {
        const value = await this.redisClient.get(key);
        return value;
    }

    async removeData(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}