import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { S3Service } from 'core/aws/s3/s3.service';
import { SignedUrlCommandTypes } from 'shared/business/file/file';
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
		if (!body.fileNames) {
			return { files: [] };
		}
		const files = await Promise.all(body.fileNames.map(
			async () => {
				const key = uuidv4();
				const url = await this.s3Service.getSignedUrl(
					key,
					SignedUrlCommandTypes.PUT_OBJECT,
					body.mineType
				);
				return {
					key,
					url
				};
			}
		));
		return {
			files
		};
	}

	async generateDownloadSignedUrl(body: Media_GenerateSignedUrlsRequestBodyDTO): Promise<Media_GenerateSignedUrlsResponseDTO> {
		if (!body.fileNames) {
			return { files: [] };
		}
		const files = await Promise.all(body.fileNames.map(
			async (key) => {
				const url = await this.s3Service.getSignedUrl(
					key,
					SignedUrlCommandTypes.GET_OBJECT
				);
				return {
					url
				};
			}
		));
		return {
			files
		};
	}
}
