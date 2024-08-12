import { IsArray } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class UserRelation_GetFollowersResponseDTO {
    @IsArray()
	followers: { userId: string }[];
}

export class UserRelation_GetFollowersDTO extends DTO {
	public static url = '/users/:userId/followers';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: UserRelation_GetFollowersResponseDTO
	) {
		super();
	}
}