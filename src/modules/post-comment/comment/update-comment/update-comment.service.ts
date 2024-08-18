import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostComment } from 'database/post-comment/post-comment';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
    PostComment_UpdateCommentRequestBodyDTO,
    PostComment_UpdateCommentRequestParamDTO,
    PostComment_UpdateCommentResponseDTO,
} from 'shared/dto/post-comment/update-comment.dto';

@Injectable()
export class UpdateCommentService {
	constructor(
		@InjectModel(PostComment.name)
		private readonly postCommentService: Model<PostComment>
	) {}

    async execute(
        bodyDTO: PostComment_UpdateCommentRequestBodyDTO,
        paramDTO: PostComment_UpdateCommentRequestParamDTO,
        authUser: AuthUserPayload
    ): Promise<PostComment_UpdateCommentResponseDTO> {
        const { commentId } = paramDTO;
        const { userId } = authUser;
        const { content } = bodyDTO;

        const comment = await this.postCommentService.findById(commentId);
        if (!comment || comment.createdBy.toString() !== userId) {
            throw new NotFoundException('Comment not found');
        }
        comment.content = content;
        comment.save();

        return {
            id: comment.id
        };
	}
}
