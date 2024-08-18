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
import { CommentMapper } from 'shared/mappers/comment.mapper';
import { UserMapper } from 'shared/mappers/user.mapper';
import { MediaModule } from 'src/modules/media/media.module';

import { CreateCommentController } from './create-comment/create-comment.controller';
import { CreateCommentService } from './create-comment/create-comment.service';
import { DeleteCommentController } from './delete-comment/delete-comment.controller';
import { DeleteCommentService } from './delete-comment/delete-comment.service';
import { ListPostCommentController } from './list-post-comment/list-post-comment.controller';
import { ListPostCommentService } from './list-post-comment/list-post-comment.service';
import { UpdateCommentController } from './update-comment/update-comment.controller';
import { UpdateCommentService } from './update-comment/update-comment.service';

@Module({
    imports: [
		MongooseModule.forFeature([
            { name: PostComment.name, schema: PostCommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
        MediaModule
    ],
    controllers: [
        CreateCommentController,
        DeleteCommentController,
        UpdateCommentController,
        ListPostCommentController
    ],
    providers: [
        CreateCommentService,
        DeleteCommentService,
        UpdateCommentService,
        ListPostCommentService,
        CommentMapper,
        UserMapper,
        Logger
    ],
    exports: [CreateCommentService]
})
export class CommentModule {}
