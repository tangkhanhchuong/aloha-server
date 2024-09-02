import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Media_GenerateSignedUrlsRequestBodyDTO {
	@ApiProperty()
	@IsArray()
	fileNames: string[];

	@ApiProperty()
	@IsString()
	@Transform(({ value }) => value?.trim())
	@IsOptional()
	mineType?: string;
}

export class FileItem {
	@IsString()
	@IsOptional()
	key?: string;

	@IsString()
	url: string;
}

export class Media_GenerateSignedUrlsResponseDTO {
	@IsArray()
	files: FileItem[];
}

export class Media_GenerateSignedUrlsDTO extends DTO {
	public static url = '/media/signed-urls';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
    public queryDTO: undefined;

	constructor(
		public bodyDTO: Media_GenerateSignedUrlsRequestBodyDTO,
		public responseDTO: Media_GenerateSignedUrlsResponseDTO
	) {
		super();
	}
}
