import { Module } from '@nestjs/common';
import { Neo4jModule as NestNeo4jModule } from 'nest-neo4j';

import { ConfigService } from 'shared/config/config.service';

import { Neo4jService } from './neo4j.service';

@Module({
    imports: [
      NestNeo4jModule.forRootAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => configService.getNeo4jConfig()
      })
    ],
    providers: [Neo4jService],
    exports: [Neo4jService]
})
export class Neo4jModule {}