import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { CommentTypes } from 'shared/constants/comment';

import { DTO, HttpMethod } from '../base.dto';

export class PostComment_CreateCommentRequestParamDTO {
	@ApiProperty({
		type: String,
		default: ''
	})
	@IsString()
	postId: string;
}

export class PostComment_CreateCommentRequestBodyDTO {
	@ApiProperty({
		type: String,
		default: 'Post content'
	})
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @ApiProperty({
        enum: CommentTypes,
        default: CommentTypes.TEXT,
    })
    @IsEnum(CommentTypes)
	type: CommentTypes;
}

export class PostComment_CreateCommentResponseDTO {
	@ApiProperty({
		type: String,
        default: 'Created Comment',
	})
	@IsString()
	id: string;
}

export class PostComment_CreateCommentDTO extends DTO {
	public static url = '/posts/:postId/comments';
	public method = HttpMethod.POST;

	public queryDTO: undefined;

    constructor(
		public bodyDTO: PostComment_CreateCommentRequestBodyDTO,
		public paramDTO: PostComment_CreateCommentRequestParamDTO,
		public responseDTO: PostComment_CreateCommentResponseDTO
	) {
		super();
	}
}