import { IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';
import { UserDTO } from './user.dto';

export class User_GetUserRequestParamDTO {
	@IsString()
	userId: string;
}

export class User_GetUserResponseDTO extends UserDTO {}

export class User_GetUserDTO extends DTO {
	public static url = '/users/:userId';
	public method = HttpMethod.GET;

	public queryDTO: undefined;
	public bodyDTO: undefined;

    constructor(
        public paramDTO: User_GetUserRequestParamDTO,
		public responseDTO: User_GetUserResponseDTO
	) {
		super();
	}
}
