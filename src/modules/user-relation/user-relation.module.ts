import { Module } from '@nestjs/common';

import { FollowModule } from './follow/follow.module';
import { InitializeUserRelationModule } from './initialize-user-relation/initialize-user-relation.module';

@Module({
    imports: [
        FollowModule,
        InitializeUserRelationModule,
    ]
})
export class UserRelationModule {}
