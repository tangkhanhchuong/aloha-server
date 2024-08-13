import * as dotenv from 'dotenv';
import { Neo4jConnection, Neo4jScheme } from 'nest-neo4j';

export class ConfigService {
	private readonly envConfig: Record<string, string>;
	constructor() {
		const result = dotenv.config();

		if (result.error) {
			this.envConfig = process.env;
		} else {
			this.envConfig = result.parsed;
		}
	}

	public get(key: string): string {
		return this.envConfig[key];
	}

	public getPortConfig(): number {
		return parseInt(this.get('PORT'));
	}

	public getMicroservicesURL(): {
		auth: string,
		user: string,
		post: string
	} {
		return {
			auth: this.get('AUTH_SERVICE_URL'),
			user: this.get('USER_SERVICE_URL'),
			post: this.get('POST_SERVICE_URL'),
		};
	}

	public getMongoConfig(): { uri: string } {
		const user = this.get('MONGO_USER');
		const pass = this.get('MONGO_PASSWORD');
		const host = this.get('MONGO_HOST');
		const port = parseInt(this.get('MONGO_PORT'));
		const dbName = this.get('MONGO_DATABASE');
		const authSource = this.get('MONGO_AUTH_SOURCE');
		let uri =
			`mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=${authSource}`;
		return { uri };
	}

	public getNeo4jConfig(): Neo4jConnection {
		const scheme = this.get('NEO4J_SCHEME') as Neo4jScheme;
		const username = this.get('NEO4J_USERNAME');
		const password = this.get('NEO4J_PASSWORD');
		const host = this.get('NEO4J_HOST');
		const port = parseInt(this.get('NEO4J_PORT'));
		return { scheme, username, password, host, port }
	}

	public getRabitMQConfig(): { uri: string } {
		return {
			uri: this.get('RABBIT_MQ_URI'),
		};
	}

	public getJwtConfig() {
		return {
			expirationTime: this.get('GATEWAY_TOKEN_EXPIRATION_TIME'),
			secret: this.get('GATEWAY_TOKEN_SECRET'),
		};
	}

	public getAWSConfig() {
		return {
			cognitoUserPoolId: this.get('AWS_COGNITO_USER_POOL_ID'),
			cognitoClientId: this.get('AWS_COGNITO_CLIENT_ID'),
			region: this.get('AWS_REGION'),
			bucketName: this.get('AWS_BUCKET_NAME'),
			accessKey: this.get('AWS_ACCESS_KEY'),
			secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY')
		};
	}
}
