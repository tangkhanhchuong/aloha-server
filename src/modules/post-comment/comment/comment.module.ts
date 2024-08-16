import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    PostComment,
    PostCommentSchema
} from 'database/post-comment/post-comment';
import {
    Post,
    PostSchema
} from 'database/post/post';

import { CreateCommentController } from './create-comment/create-comment.controller';
import { CreateCommentService } from './create-comment/create-comment.service';

@Module({
    imports: [
		MongooseModule.forFeature([
            { name: PostComment.name, schema: PostCommentSchema },
            { name: Post.name, schema: PostSchema },
        ])
    ],
    controllers: [CreateCommentController],
    providers: [
        CreateCommentService,
        Logger
    ],
    exports: [CreateCommentService]
})
export class CommentModule {}
