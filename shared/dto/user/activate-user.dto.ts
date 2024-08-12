import { IsBoolean } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class User_ActivateUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class User_ActivateUserDTO extends DTO {
	public static url = '/users/:id/activate';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: User_ActivateUserResponseDTO
	) {
		super();
	}
}
