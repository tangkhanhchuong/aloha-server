import { Module } from '@nestjs/common';

import { PostManagementModule } from './post-management/post-management.module';
import { ReactToPostModule } from './react-to-post/react-to-post.module';

@Module({
	imports: [
		PostManagementModule,
		ReactToPostModule,
	]
})
export class PostModule {}
