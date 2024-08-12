import { IsArray } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class UserRelation_GetFolloweesResponseDTO {
    @IsArray()
	followees: { userId: string }[];
}

export class UserRelation_GetFolloweesDTO extends DTO {
	public static url = '/users/:userId/followees';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: UserRelation_GetFolloweesResponseDTO
	) {
		super();
	}
}