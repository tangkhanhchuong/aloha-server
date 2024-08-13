import { IsBoolean } from 'class-validator';

import { DTO, HttpMedthod } from '../base.dto';

export class User_ActivateUserResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class User_ActivateUserDTO extends DTO {
	public static url = '/users/:id/activate';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: User_ActivateUserResponseDTO
	) {
		super();
	}
}
