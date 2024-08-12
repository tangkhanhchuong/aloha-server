import { Module } from '@nestjs/common';

import { RmqModule } from 'core/rmq/rmq.module';

import { PostManagementModule } from './post-management/post-management.module';
import { PostReactionModule } from './post-reaction/post-reaction.module';

@Module({
	imports: [
		RmqModule,
		PostManagementModule,
		PostReactionModule,
	]
})
export class PostModule {}
