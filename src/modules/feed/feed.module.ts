import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    Post,
    PostSchema
} from 'database/post/post';
import {
    PostReaction,
    PostReactionSchema
} from 'database/post/post-reaction.dto';
import {
    User,
    UserSchema
} from 'database/user/user';
import { PostMapper } from 'shared/mappers/post.mapper';
import { UserMapper } from 'shared/mappers/user.mapper';

import { MediaModule } from '../media/media.module';
import {
    GetHomeTimelineController
} from './get-home-timeline/get-home-timeline.controller';
import {
    GetHomeTimelineService
} from './get-home-timeline/get-home-timeline.service';
import { GetUserTimelineController } from './get-user-timeline/get-user-timeline.controller';
import { GetUserTimelineService } from './get-user-timeline/get-user-timeline.service';

@Module({
    imports: [
		MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: PostReaction.name, schema: PostReactionSchema },
			{ name: User.name, schema: UserSchema }
        ]),
        MediaModule
    ],
    controllers: [
        GetHomeTimelineController,
        GetUserTimelineController
    ],
    providers: [
        GetHomeTimelineService,
        GetUserTimelineService,
        PostMapper,
        UserMapper,
        Logger
    ],
    exports: [
        GetHomeTimelineService
    ]
})
export class FeedModule {}
