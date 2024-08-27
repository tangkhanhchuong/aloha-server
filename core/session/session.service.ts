import { Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from 'core/config/config.service';
import { RedisService } from 'core/redis/redis.service';

@Injectable()
export class SessionService {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
    ) {}

    async addSession<V>(key: string, value: V, expiredInSeconds?: number) {
        const currentValue = await this.redisService.getData(key);
        const updatedValue = currentValue
            ? { ...JSON.parse(currentValue), ...value }
            : { ...value };
        await this.redisService.setData(
            key,
            JSON.stringify({
                ...updatedValue,
            }),
            expiredInSeconds || parseInt(this.configService.getJwtConfig().expirationTime)
        );
    }

    async getSession<V>(key: string): Promise<V> {
        const value = await this.redisService.getData(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    async removeSession(key: string) {
        await this.redisService.removeData(key);
    }
}