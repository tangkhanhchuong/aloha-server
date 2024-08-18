import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

import { ConfigService } from 'shared/config/config.service';

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

    async setData<V>(key: string, value: V, expiredInSeconds?: number) {
        await this.redisClient.set(
            key,
            JSON.stringify(value),
            'EX',
            expiredInSeconds
        );
    }

    async getData(key: string) {
        const value = await this.redisClient.get(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    async removeData(key: string) {
        
        const value = await this.redisClient.get(key);
        console.log({ key, value });
        await this.redisClient.del(key);
    }
}