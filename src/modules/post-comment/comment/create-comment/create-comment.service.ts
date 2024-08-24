import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostComment } from 'database/post-comment/post-comment';
import { Post } from 'database/post/post';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import { CommentTypes } from 'shared/business/comment/comment';
import {
    PostComment_CreateCommentRequestBodyDTO,
    PostComment_CreateCommentRequestParamDTO,
    PostComment_CreateCommentResponseDTO
} from 'shared/dto/post-comment/create-comment.dto';

@Injectable()
export class CreateCommentService {
	constructor(
		@InjectModel(Post.name)
		private readonly postService: Model<Post>,
		@InjectModel(PostComment.name)
		private readonly postCommentService: Model<PostComment>
	) {}

    async execute(
        bodyDTO: PostComment_CreateCommentRequestBodyDTO,
        paramDTO: PostComment_CreateCommentRequestParamDTO,
        authUser: AuthUserPayload
    ): Promise<PostComment_CreateCommentResponseDTO> {
        const { type, content } = bodyDTO;
        const { postId } = paramDTO;
        const { userId } = authUser;

        if (type !== CommentTypes.TEXT) {
            throw new BadRequestException('Comment type is not supported!');
        }
        
        const post = await this.postService.findById(postId);
        if (!post || post.createdBy.toString() !== userId) {
            throw new NotFoundException('Post not found');
        }

        const postComment = await this.postCommentService.create({
            post: postId,
            content,
            type,
            createdBy: userId
        });
        post.numberOfComments += 1;
        post.save();
        return {
            id: postComment.id
        };
	}
}
