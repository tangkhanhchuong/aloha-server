import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Post_GetPostResponseDTO {
	@ApiProperty({
		type: String,
		default: 'Found Post',
		required: true,
	})
	@IsString()
	title: string;

	@ApiProperty({
		type: String,
		default: 'Found Post Content',
		required: true,
	})
	@IsString()
    content: string;

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	fileUrls: string[];

	@ApiProperty({
		type: Number,
		default: 0
	})
	@IsNumber()
	numberOfReactions: number;
	
	@ApiProperty({
		type: Number,
		default: 0
	})
	@IsNumber()
	numberOfComments: number;

	@ApiProperty({
		type: String,
		default: ''
	})
	@IsNumber()
	createdAt: string;

	@ApiProperty({
		type: String,
		default: ''
	})
	@IsNumber()
	createdBy: string;
}

export class Post_GetPostDTO extends DTO {
	public static url = '/posts/:id';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public responseDTO: Post_GetPostResponseDTO
	) {
		super();
	}
}
