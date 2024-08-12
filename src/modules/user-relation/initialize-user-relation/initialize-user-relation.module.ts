import { Logger, Module } from '@nestjs/common';

import { Neo4jModule } from 'core/neo4j/neo4j.module';
import { RmqModule } from 'core/rmq/rmq.module';

import { InitializeUserRelationService } from './initialize-user-relation.service';

@Module({
	imports: [
		RmqModule,
		Neo4jModule
	],
    providers: [
        InitializeUserRelationService,
		Logger
	],
	exports: [
		InitializeUserRelationService
	]
})
export class InitializeUserRelationModule {}
