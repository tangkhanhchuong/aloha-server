import { IsBoolean } from 'class-validator';

import { DTO, METHOD } from '../base.dto';

export class User_DeactivateUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class User_DeactivateUserDTO extends DTO {
	public static url = '/users/:id/deactivate';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: User_DeactivateUserResponseDTO
	) {
		super();
	}
}
