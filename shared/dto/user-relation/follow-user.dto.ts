import { IsBoolean } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class UserRelation_FollowUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class UserRelation_FollowUserDTO extends DTO {
	public static url = '/users/:userId/follow';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: UserRelation_FollowUserResponseDTO
	) {
		super();
	}
}