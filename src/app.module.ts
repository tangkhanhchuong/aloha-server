import { Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from 'core/config/config.service';
import { GlobalExceptionFilter } from 'shared/filter/global-exception.filter';
import { ResponseTransformer } from 'shared/interceptors/response-transformer.interceptor';
import { SharedModule } from 'shared/shared.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FeedModule } from './modules/feed/feed.module';
import { MediaModule } from './modules/media/media.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { PostModule } from './modules/post/post.module';
import { UserRelationModule } from './modules/user-relation/user-relation.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
		}),
		SharedModule,
		AuthModule,
		UserModule,
		UserRelationModule,
		PostModule,
		PostCommentModule,
		MediaModule,
		FeedModule,
		NotificationModule
	],
	providers: [
		AppService,
		Logger,
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseTransformer,
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
	controllers: [AppController],
})
export class AppModule {}
