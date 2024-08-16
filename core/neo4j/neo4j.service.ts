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
		src: { id: string, label: string },
		dest: { id: string, label: string }
	): Promise<boolean> {
		const session = this.neo4jService.getWriteSession();
		await session.run(
			`
				MATCH (src:${src.label})-[r:${relationType}]->(dest:${dest.label})
				WHERE src.id = '${src.id}' AND dest.id = '${dest.id}'
				DELETE r
			`
		);
		session.close();
		return true;
	}

	async createRelation(
		relationType: SocialRelations,
		src: { id: string, label: string },
		dest: { id: string, label: string },
		additionalProperties?: { [key: string]: string }
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		let query = `
			MATCH (src:${src.label} {id: '${src.id}'})
			MATCH (dest:${dest.label} {id: '${dest.id}'})
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
		src: { id: string, label: string },
		dest: { id: string, label: string },
		updatedProperties?: { [key: string]: string }
	): Promise<Record<string, string>> {
		const session = this.neo4jService.getWriteSession();
		let query = `
			MATCH (src:${src.label})-[r:${relationType}]->(dest:${dest.label}})
			WHERE src.id=${src.id} AND dest.id = ${dest.id}
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
		src: { id: string, label: string },
		dest?: { id: string, label: string },
		pagination?: { skip: number, limit: number }
	): Promise<{ items: Record<string, string>[], count: number }> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (src:${src.label})-[r:${relationType}]->(dest${dest ? `:${dest.label}` : ''})`;
		let whereQuery = ` WHERE src.id = '${src.id}'`;
		
		if (dest) {
			whereQuery += ` AND dest.id = '${dest.id}'`;
		}
		let query = matchQuery + whereQuery + ` RETURN dest, collect(dest) AS count`;

		if (pagination) {
			query += ` SKIP ${pagination.skip} LIMIT ${pagination.limit}`;
		}
		const result = await session.run(query);
		session.close();
		
		return {
			items: result.records.map(record => record.get('dest').properties) || [],
			count: result.records[0]?.get('count')[0].identity.toNumber() || 0
		};
	}

	async getSourceNodes(
		relationType: SocialRelations,
		dest: { id: string, label: string },
		src?: { id: string, label: string },
		pagination?: { skip: number, limit: number }
	): Promise<{ items: Record<string, string>[], count: number }> {
		const session = this.neo4jService.getReadSession();
		let matchQuery = `MATCH (src${src ? `:${src.label}` : ''})-[r:${relationType}]->(dest:${dest.label})`;
		let whereQuery = ` WHERE dest.id = '${dest.id}'`;
		
		if (src) {
			whereQuery += ` AND src.id = '${src.id}'`;
		}
		let query = matchQuery + whereQuery + ` RETURN src, collect(src) AS count`;
		
		if (pagination) {
			query += ` SKIP ${pagination.skip} LIMIT ${pagination.limit}`;
		}

		const result = await session.run(query);
		session.close();	
		
		return {
			items: result.records.map(record => record.get('src').properties) || [],
			count: result.records[0]?.get('count')[0].identity.toNumber() || 0
		};
	}

	private toProps(props: any): string {
		return `{${Object.keys(props)
			.map((key) => `${key}: "${props[key]}"`)
			.join(', ')}}`;
	}
}