import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Neo4jModule } from 'core/neo4j/neo4j.module';
import {
    Post,
    PostSchema
} from 'database/post/post';
import {
    User,
    UserSchema
} from 'database/user/user';

import { ReactToPostController } from './react-to-post.controller';
import { ReactToPostService } from './react-to-post.service';

@Module({
    imports: [
		MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: User.name, schema: UserSchema },
		]),
		Neo4jModule
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
