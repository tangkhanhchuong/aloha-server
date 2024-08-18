import { IsBoolean } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Auth_LogoutResponseDTO {
    @IsBoolean()
    status: boolean;
}

export class Auth_LogoutDTO extends DTO {
	public static url = '/auth/logout';
	public method = HttpMethod.POST;

	public bodyDTO: undefined;
	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public responseDTO: Auth_LogoutResponseDTO
	) {
		super();
	}
}