import { Module } from '@nestjs/common';

import { FollowModule } from './follow/follow.module';

@Module({
    imports: [
        FollowModule,
    ]
})
export class UserRelationModule {}
