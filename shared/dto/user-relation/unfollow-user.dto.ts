import { IsBoolean, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class UserRelation_UnfollowUserRequestParamDTO {
	@IsString()
	userId: string;
}

export class UserRelation_UnfollowUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class UserRelation_UnfollowUserDTO extends DTO {
	public static url = '/users/:userId/unfollow';
	public method = HttpMethod.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public paramDTO: UserRelation_UnfollowUserRequestParamDTO,
		public responseDTO: UserRelation_UnfollowUserResponseDTO
	) {
		super();
	}
}
