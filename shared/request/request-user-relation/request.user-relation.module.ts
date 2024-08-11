import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigService } from 'shared/config/config.service';

import { RequestUserRelationService } from './request-user-relation.service';

@Module({
	imports: [
		HttpModule.registerAsync({
			inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                console.log({ services: configService.getMicroservicesURL() })
                return ({
                    baseURL: configService.getMicroservicesURL().user
                })
            },
		}),
    ],
    providers: [
        RequestUserRelationService
    ],
    exports: [
        RequestUserRelationService
    ]
})
export class RequestUserRelationModule {}