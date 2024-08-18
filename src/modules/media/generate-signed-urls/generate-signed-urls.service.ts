import { Injectable } from '@nestjs/common';

import { S3Service } from 'core/aws/s3/s3.service';
import { SignedUrlCommandTypes } from 'core/aws/s3/s3.utils';
import {
	Media_GenerateSignedUrlsRequestBodyDTO,
	Media_GenerateSignedUrlsResponseDTO
} from 'shared/dto/media/generate-signed-urls.dto';

@Injectable()
export class GenerateSignedUrlsService {
	constructor(
		private readonly s3Service: S3Service
	) {}
    
	async generateUploadSignedUrl(body: Media_GenerateSignedUrlsRequestBodyDTO): Promise<Media_GenerateSignedUrlsResponseDTO> {
		if (!body.fileKeys) {
			return { urls: [] };
		}
		const urls = await Promise.all(body.fileKeys.map(
			key => this.s3Service.getSignedUrl(
				key,
				SignedUrlCommandTypes.PUT_OBJECT,
				body.mineType
			)
		));
		return {
			urls
		};
	}

	async generateDownloadSignedUrl(body: Media_GenerateSignedUrlsRequestBodyDTO): Promise<Media_GenerateSignedUrlsResponseDTO> {
		if (!body.fileKeys) {
			return { urls: [] };
		}
		const urls = await Promise.all(body.fileKeys.map(
			key => this.s3Service.getSignedUrl(
				key,
				SignedUrlCommandTypes.GET_OBJECT
			)
		));
		return {
			urls
		};
	}
}
