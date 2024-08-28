import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CognitoModule } from 'core/aws/cognito/cognito.module';
import {
	Post,
	PostSchema
} from 'database/post/post';
import {
	User,
	UserSchema
} from 'database/user/user';
import { PostMapper } from 'shared/mappers/post.mapper';
import { UserMapper } from 'shared/mappers/user.mapper';
import { MediaModule } from 'src/modules/media/media.module';

import { BookmarkPostController } from './bookmark-post/bookmark-post.controller';
import { BookmarkPostService } from './bookmark-post/bookmark-post.service';
import { CreatePostController } from './create-post/create-post.controller';
import { CreatePostService } from './create-post/create-post.service';
import { DeletePostController } from './delete-post/delete-post.controller';
import { DeletePostService } from './delete-post/delete-post.service';
import { GetPostController } from './get-post/get-post.controller';
import { GetPostService } from './get-post/get-post.service';
import { ListBookmarkPostsController } from './list-bookmark-posts/list-bookmark-posts.controller';
import { ListBookmarkPostsService } from './list-bookmark-posts/list-bookmark-posts.service';
import { Post_UpdatePostController } from './update-post/update-post.controller';
import { Post_UpdatePostService } from './update-post/update-post.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Post.name, schema: PostSchema },
			{ name: User.name, schema: UserSchema }
		]),
		CognitoModule,
		MediaModule
	],
	controllers: [
		GetPostController,
		CreatePostController,
		Post_UpdatePostController,
		DeletePostController,
		BookmarkPostController,
		ListBookmarkPostsController
	],
    providers: [
		GetPostService,
		CreatePostService,
		Post_UpdatePostService,
		DeletePostService,
		BookmarkPostService,
		ListBookmarkPostsService,
		PostMapper,
		UserMapper,
		Logger
    ],
	exports: [],
})
export class PostManagementModule {}
