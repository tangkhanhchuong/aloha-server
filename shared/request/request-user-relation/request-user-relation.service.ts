import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
	Relation_CreateUserRequestDTO,
	Relation_CreateUserResponseDTO,
	Relation_CreateUserURL
} from 'shared/dto/relation/create-user';

@Injectable()
export class RequestUserRelationService {
	constructor(private readonly httpService: HttpService) { }
	
	async createUser(body: Relation_CreateUserRequestDTO): Promise<Relation_CreateUserResponseDTO> {
		try {
			const response = await this.httpService.post<Relation_CreateUserResponseDTO>(Relation_CreateUserURL, body).toPromise();
			return response.data;
		} catch (error) {
			console.error('CreateUser', error);
			throw error;
		}
	}
}
