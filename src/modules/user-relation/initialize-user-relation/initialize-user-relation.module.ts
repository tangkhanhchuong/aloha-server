import { Logger, Module } from '@nestjs/common';

import { Neo4jModule } from 'core/neo4j/neo4j.module';
import { RmqModule } from 'core/rmq/rmq.module';

import { InitializeUserRelationController } from './initialize-user-relation.controller';
import { InitializeUserRelationService } from './initialize-user-relation.service';

@Module({
	imports: [
		RmqModule,
		Neo4jModule
	],
    controllers: [
        InitializeUserRelationController
	],
    providers: [
        InitializeUserRelationService,
		Logger
	],
	exports: [],
})
export class InitializeUserRelationModule {}
