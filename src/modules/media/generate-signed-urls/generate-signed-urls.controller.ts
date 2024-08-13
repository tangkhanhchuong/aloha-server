import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CognitoGuard } from 'core/aws/cognito/cognito.guard';
import {
	Media_GenerateSignedUrlsDTO,
	Media_GenerateSignedUrlsRequestBodyDTO,
	Media_GenerateSignedUrlsResponseDTO
} from 'shared/dto/media/generate-signed-urls.dto';

import { GenerateSignedUrlsService } from './generate-signed-urls.service';

@Controller()
@ApiBearerAuth('access-token')
export class GenerateSignedUrlsController {
	constructor(
		private readonly generateSignedUrlsService: GenerateSignedUrlsService,

	) {}

	@Post(Media_GenerateSignedUrlsDTO.url)
	@HttpCode(HttpStatus.OK)
	@UseGuards(CognitoGuard)
	async generateSignedUrls(@Body() body: Media_GenerateSignedUrlsRequestBodyDTO): Promise<Media_GenerateSignedUrlsResponseDTO> {
		return this.generateSignedUrlsService.generateUploadSignedUrl(body);
	}
}
