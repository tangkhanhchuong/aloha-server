import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostComment } from 'database/post-comment/post-comment';
import { AuthUserPayload } from 'shared/decorators/auth-user.decorator';
import {
    PostComment_DeleteCommentRequestParamDTO,
    PostComment_DeleteCommentResponseDTO
} from 'shared/dto/post-comment/delete-comment.dto';

@Injectable()
export class DeleteCommentService {
	constructor(
		@InjectModel(PostComment.name)
		private readonly postCommentService: Model<PostComment>
	) {}

    async execute(
        paramDTO: PostComment_DeleteCommentRequestParamDTO,
        authUser: AuthUserPayload
    ): Promise<PostComment_DeleteCommentResponseDTO> {
        const { commentId } = paramDTO;
        const { userId } = authUser;

        const comment = await this.postCommentService.findById(commentId);
        if (!comment || comment.createdBy.toString() !== userId) {
            throw new NotFoundException('Comment not found');
        }

        await this.postCommentService.deleteOne({ id: comment.id });

        return {
            status: true
        };
	}
}
