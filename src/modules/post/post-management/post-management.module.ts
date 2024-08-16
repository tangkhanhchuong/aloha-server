import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CognitoModule } from 'core/aws/cognito/cognito.module';
import { RmqModule } from 'core/rmq/rmq.module';
import { Post, PostSchema } from 'database/post/post';
import { MediaModule } from 'src/modules/media/media.module';

import { CreatePostController } from './create-post/create-post.controller';
import { CreatePostService } from './create-post/create-post.service';
import { DeletePostController } from './delete-post/delete-post.controller';
import { DeletePostService } from './delete-post/delete-post.service';
import { GetPostController } from './get-post/get-post.controller';
import { GetPostService } from './get-post/get-post.service';
import { Post_UpdatePostController } from './update-post/update-post.controller';
import { Post_UpdatePostService } from './update-post/update-post.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Post.name, schema: PostSchema }
		]),
		RmqModule,
		CognitoModule,
		MediaModule
	],
	controllers: [
		GetPostController,
		CreatePostController,
		Post_UpdatePostController,
		DeletePostController
	],
    providers: [
		GetPostService,
		CreatePostService,
		Post_UpdatePostService,
		DeletePostService,
		Logger
    ],
	exports: [],
})
export class PostManagementModule {}
