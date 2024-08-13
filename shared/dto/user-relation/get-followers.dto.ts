import { IsArray } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class UserRelation_GetFollowersResponseDTO {
    @IsArray()
	followers: { userId: string }[];
}

export class UserRelation_GetFollowersDTO extends DTO {
	public static url = '/users/:userId/followers';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: UserRelation_GetFollowersResponseDTO
	) {
		super();
	}
}