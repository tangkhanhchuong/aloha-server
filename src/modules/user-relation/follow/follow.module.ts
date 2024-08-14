import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Neo4jModule } from 'core/neo4j/neo4j.module';
import { RmqModule } from 'core/rmq/rmq.module';
import { User, UserSchema } from 'database/user/user';

import { FollowUserController } from './follow-user/follow-user.controller';
import { FollowUserService } from './follow-user/follow-user.service';
import { GetFolloweesController } from './get-followees/get-followees.controller';
import { GetFolloweesService } from './get-followees/get-followees.service';
import { GetFollowersController } from './get-followers/get-followers.controller';
import { GetFollowersService } from './get-followers/get-followers.service';
import { UnfollowUserController } from './unfollow-user/unfollow-user.controller';
import { UnfollowUserService } from './unfollow-user/unfollow-user.service';

@Module({
	imports: [
		RmqModule,
		Neo4jModule,
		MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
		]),
	],
	controllers: [
		FollowUserController,
		UnfollowUserController,
		GetFolloweesController,
		GetFollowersController
	],
	providers: [
		FollowUserService,
		UnfollowUserService,
		GetFolloweesService,
		GetFollowersService,
		Logger
	],
	exports: [
		FollowUserService,
		UnfollowUserService,
		GetFolloweesService,
		GetFollowersService,
	],
})
export class FollowModule {}
