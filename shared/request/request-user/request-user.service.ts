import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
	User_CreateUserRequestDTO,
	User_CreateUserResponseDTO,
	User_CreateUserURL
} from 'shared/dto/user/create-user.dto';
import {
	User_SearchUsersRequestDTO,
	User_SearchUsersResponseDTO,
	User_SearchUsersURL
} from 'shared/dto/user/search-users.dto';

@Injectable()
export class RequestUserService {
	constructor(private readonly httpService: HttpService) { }
	
	async createUser(body: User_CreateUserRequestDTO): Promise<User_CreateUserResponseDTO> {
		try {
			const response = await this.httpService.post<User_CreateUserResponseDTO>(User_CreateUserURL, body).toPromise();
			return response.data;
		} catch (error) {
			console.error('CreateUser', error);
			throw error;
		}
	}

	async searchUsers(body: User_SearchUsersRequestDTO): Promise<User_SearchUsersResponseDTO> {
		try {
			console.log(User_SearchUsersURL)
			const response = await this.httpService.post<User_SearchUsersResponseDTO>(User_SearchUsersURL, body).toPromise();
			return response.data;
		} catch (error) {
			console.error('SearchUsers', error);
			throw error;
		}
	}
}
