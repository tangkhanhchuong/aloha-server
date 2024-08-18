import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
	UserRelation,
	UserRelationSchema
} from 'database/user-relation/user-relation';
import { User, UserSchema } from 'database/user/user';
import { UserMapper } from 'shared/mappers/user.mapper';
import { MediaModule } from 'src/modules/media/media.module';

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
		MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: UserRelation.name, schema: UserRelationSchema },
		]),
		MediaModule
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
		UserMapper,
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
