import { Injectable } from '@nestjs/common';
import { Neo4jService as NestNeo4jService } from 'nest-neo4j';

import { SocialRelations } from 'shared/constants/neo4j';

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
		relationType: SocialRelations,
		srcId: string,
		srcLabel: string,
		destId: string,
		destLabel: string,
	): Promise<boolean> {
		const session = this.neo4jService.getWriteSession();
		await session.run(
			`
				MATCH (src:${srcLabel})-[r:${relationType}]->(dest:${destLabel})
				WHERE src.id = '${srcId}' AND dest.id = '${destId}'
				DELETE r
			`
		);
		session.close();
		return true;
	}

	async createRelation(
		relationType: SocialRelations,
		srcId: string,
		srcLabel: string,
		destId: string,
		destLabel: string,
		additionalProperties?: { [key: string]: string }
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		let query = `
			MATCH (src:${srcLabel} {id: '${srcId}'})
			MATCH (dest:${destLabel} {id: '${destId}'})
			MERGE (src)-[r:${relationType}]->(dest)
		`;
		if (additionalProperties) {
			query += `
				SET r = {${Object.keys(additionalProperties).map((key) => `${key}: '${additionalProperties[key]}'`).join(', ')}}
			`;
		}
		query += `
			RETURN r	
		`;
		const result = await session.run(query);
		session.close();
		if (!result.records.length) {
			return null;
		}
		return {
			startNodeElementId: result.records[0].get('r').startNodeElementId,
			endNodeElementId: result.records[0].get('r').endNodeElementId,
			elementId: result.records[0].get('r').elementId,
			type: result.records[0].get('r').type
		};
	}


	async updateRelation(
		relationType: SocialRelations,
		srcId: string,
		srcLabel: string,
		destId: string,
		destLabel: string,
		updatedProperties?: { [key: string]: string }
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		let query = `
			MATCH (src:${srcLabel})-[r:${relationType}]->(dest:${destLabel}})
			WHERE src.id=${srcId} AND dest.id = ${destId}
			SET r = {${Object.keys(updatedProperties).map((key) => `${key}: '${updatedProperties[key]}'`).join(', ')}}
			RETURN r
		`;
		const result = await session.run(query);
		session.close();
		if (!result.records.length) {
			return null;
		}
		return {
			startNodeElementId: result.records[0].get('r').startNodeElementId,
			endNodeElementId: result.records[0].get('r').endNodeElementId,
			elementId: result.records[0].get('r').elementId,
			type: result.records[0].get('r').type
		};
	}

	async getDestinationNodes(
		relationType: SocialRelations,
		srcId: string,
		srcLabel: string,
		destId?: string,
		destLabel?: string
	): Promise<Record<string, string>[]> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (src:${srcLabel})-[r:${relationType}]->(dest${destId ? `:${destLabel}` : ''})`;
		let whereQuery = ` WHERE src.id = '${srcId}'`;
		
		if (destId && destLabel) {
			whereQuery += ` AND dest.id = '${destId}'`;
		}
		const query = matchQuery + whereQuery + ` RETURN dest`;
		const result = await session.run(query);
		session.close();	
		
		return result.records.map(record => record.get('dest').properties);
	}

	async getSourceNodes(
		relationType: SocialRelations,
		destId: string,
		destLabel: string,
		srcId?: string,
		srcLabel?: string,
	): Promise<Record<string, string>[]> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (src${srcId ? `:${srcLabel}` : ''})-[r:${relationType}]->(dest:${destLabel})`;
		let whereQuery = ` WHERE dest.id = '${destId}'`;
		
		if (srcId && srcLabel) {
			whereQuery += ` AND src.id = '${srcId}'`;
		}
		const query = matchQuery + whereQuery + ` RETURN src`;
		const result = await session.run(query);
		session.close();	
		
		return result.records.map(record => record.get('src').properties);
	}

	private toProps(props: any): string {
		return `{${Object.keys(props)
			.map((key) => `${key}: "${props[key]}"`)
			.join(', ')}}`;
	}
}