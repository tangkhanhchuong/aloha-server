import { Module } from '@nestjs/common';

import { RmqModule } from 'core/rmq/rmq.module';

import { PostManagementModule } from './post-management/post-management.module';
import { ReactToPostModule } from './reaction-to-post/react-to-post.module';

@Module({
	imports: [
		RmqModule,
		PostManagementModule,
		ReactToPostModule,
	]
})
export class PostModule {}
