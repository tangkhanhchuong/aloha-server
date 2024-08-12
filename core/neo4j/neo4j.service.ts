import { Injectable } from '@nestjs/common';
import { Neo4jService as NestNeo4jService } from 'nest-neo4j';

import { SOCIAL_RELATIONS } from 'shared/constants/neo4j';

@Injectable()
export class Neo4jService {
	constructor(private readonly neo4jService: NestNeo4jService) {}

	async createNode(
		label: string,
		props: Record<string, string>
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		const result = await session.run(
			`CREATE (n:${label} ${this.toProps(props)}) RETURN n`
		);
		session.close();
		return {
			...result.records[0].get('n').properties,
			elementId: result.records[0].get('n').elementId
		};
	}

	async removeRelation(
		relationType: SOCIAL_RELATIONS,
		user1Id: string,
		user1Label: string,
		user2Id: string,
		user2Label: string,
	): Promise<boolean> {
		const session = this.neo4jService.getWriteSession();
		await session.run(
			`
				MATCH (u1:${user1Label})-[r:${relationType}]->(u2:${user2Label})
				WHERE u1.userId = '${user1Id}' AND u2.userId = '${user2Id}'
				DELETE r
			`
		);
		session.close();
		return true;
	}

	async createRelation(
		relationType: SOCIAL_RELATIONS,
		user1Id: string,
		user1Label: string,
		user2Id: string,
		user2Label: string,
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		const result = await session.run(
			`
				MATCH (u1:${user1Label} {userId: '${user1Id}'})
				MATCH (u2:${user2Label} {userId: '${user2Id}'})
				MERGE (u1)-[r:${relationType}]->(u2)
				RETURN r
			`
		);
		session.close();
		return {
			startNodeElementId: result.records[0].get('r').startNodeElementId,
			endNodeElementId: result.records[0].get('r').endNodeElementId,
			elementId: result.records[0].get('r').elementId,
			type: result.records[0].get('r').type
		};
	}

	async getDestinationNodes(
		relationType: SOCIAL_RELATIONS,
		srcId: string,
		srcLabel: string,
		destId?: string,
		destLabel?: string
	): Promise<Record<string, string>[]> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (u1:${srcLabel})-[r:${relationType}]->(u2${destId ? `:${destLabel}` : ''})`;
		let whereQuery = ` WHERE u1.userId = '${srcId}'`;
		
		if (destId && destLabel) {
			whereQuery += ` AND u2.userId = '${destId}'`;
		}
		const query = matchQuery + whereQuery + ` RETURN u2`;
		const result = await session.run(query);
		session.close();	
		
		return result.records.map(record => record.get('u2').properties);
	}

	async getSourceNodes(
		relationType: SOCIAL_RELATIONS,
		destId: string,
		destLabel: string,
		srcId?: string,
		srcLabel?: string,
	): Promise<Record<string, string>[]> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (u1${srcId ? `:${srcLabel}` : ''})-[r:${relationType}]->(u2:${destLabel})`;
		let whereQuery = ` WHERE u2.userId = '${destId}'`;
		
		if (srcId && srcLabel) {
			whereQuery += ` AND u1.userId = '${srcId}'`;
		}
		const query = matchQuery + whereQuery + ` RETURN u1`;
		const result = await session.run(query);
		session.close();	
		
		return result.records.map(record => record.get('u1').properties);
	}

	private toProps(props: any): string {
		return `{${Object.keys(props)
			.map((key) => `${key}: "${props[key]}"`)
			.join(', ')}}`;
	}
}