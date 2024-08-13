import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from 'shared/config/config.service';
import { ErrorMessage } from 'shared/constants/error-message';

import {
    isValidFileExtension,
    SIGNED_URL_EXPIRED_IN,
    SignedUrlCommandTypes
} from './s3.utils';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

	constructor(configService: ConfigService) {
		const awsConfig = configService.getAWSConfig();
		this.s3Client = new S3Client({
            credentials: {
                accessKeyId: awsConfig.accessKey,
                secretAccessKey: awsConfig.secretAccessKey,
            },
            region: awsConfig.region,
        });
        this.bucketName = awsConfig.bucketName;
    }

    public async getSignedUrl(
        key: string,
        mineType: string,
        signedType: SignedUrlCommandTypes = SignedUrlCommandTypes.GET_OBJECT
    ): Promise<string> {
        const isValidExtension = isValidFileExtension(key, mineType);
        if (!isValidExtension) {
            throw new BadRequestException(ErrorMessage.INVALID_FILE_EXTENSION);
        }

        const command = signedType === SignedUrlCommandTypes.PUT_OBJECT
            ? new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })
            : new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
        return await getSignedUrl(this.s3Client, command, { expiresIn: SIGNED_URL_EXPIRED_IN });
	}

}
