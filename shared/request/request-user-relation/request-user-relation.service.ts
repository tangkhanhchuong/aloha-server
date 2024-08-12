import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
	UserRelation_IntializeUserRelationRequestDTO,
	UserRelation_IntializeUserRelationResponseDTO,
	UserRelation_IntializeUserRelationURL
} from 'shared/dto/user-relation/initialize-user-relation.dto';

@Injectable()
export class RequestUserRelationService {
	constructor(private readonly httpService: HttpService) { }
	
	async createUser(body: UserRelation_IntializeUserRelationRequestDTO): Promise<UserRelation_IntializeUserRelationResponseDTO> {
		try {
			const response = await this.httpService.post<UserRelation_IntializeUserRelationResponseDTO>(UserRelation_IntializeUserRelationURL, body).toPromise();
			return response.data;
		} catch (error) {
			console.error('CreateUser', error);
			throw error;
		}
	}
}
