import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    Post,
    PostSchema
} from 'database/post/post';
import {
    PostReaction,
    PostReactionSchema
} from 'database/post/post-reaction';

import { ReactToPostController } from './react-to-post.controller';
import { ReactToPostService } from './react-to-post.service';

@Module({
    imports: [
		MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
			{ name: PostReaction.name, schema: PostReactionSchema }
		]),
    ],
    controllers: [
        ReactToPostController
    ],
    providers: [
        ReactToPostService,
        Logger
    ]
})
export class ReactToPostModule {}
