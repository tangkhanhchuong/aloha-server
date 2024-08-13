import { Logger, Module } from '@nestjs/common';

import { S3Module } from 'core/aws/s3/s3.module';

import { GenerateSignedUrlsController } from './generate-signed-urls/generate-signed-urls.controller';
import { GenerateSignedUrlsService } from './generate-signed-urls/generate-signed-urls.service';

@Module({
    imports: [
        S3Module
    ],
    controllers: [
        GenerateSignedUrlsController
    ],
    providers: [
        Logger,
        GenerateSignedUrlsService
    ],
    exports: [
        GenerateSignedUrlsService
    ]
})
export class MediaModule {}
