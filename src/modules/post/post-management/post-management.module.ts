import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RmqModule } from 'core/rmq/rmq.module';
import { Post, PostSchema } from 'database/post/post';

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
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		RmqModule,
	],
	controllers: [
		GetPostController,
		CreatePostController,
		Post_UpdatePostController,
		DeletePostController
	],
    providers: [
		Logger,
		GetPostService,
		CreatePostService,
		Post_UpdatePostService,
		DeletePostService
    ],
	exports: [],
})
export class PostManagementModule {}
