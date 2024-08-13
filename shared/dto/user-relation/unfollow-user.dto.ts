import { IsBoolean } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class UserRelation_UnfollowUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class UserRelation_UnfollowUserDTO extends DTO {
	public static url = '/users/:userId/unfollow';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: UserRelation_UnfollowUserResponseDTO
	) {
		super();
	}
}
