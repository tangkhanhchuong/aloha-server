import { Injectable } from '@nestjs/common';

import { RedisService } from 'core/redis/redis.service';

@Injectable()
export class SessionService {
    constructor(
        private readonly redisService: RedisService
    ) {}

    async addSession<V>(key: string, value: V, expiredInSeconds?: number) {
        await this.redisService.setData(
            key,
            JSON.stringify(value),
            expiredInSeconds
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