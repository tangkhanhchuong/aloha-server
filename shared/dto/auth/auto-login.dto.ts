import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";

export class Auth_AutoLoginRequestBodyDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	refreshToken: string;
}

export class Auth_AutoLoginResponseDTO {
	@ApiProperty({
		default: '',
	})
	accessToken: string;
}

export class Auth_AutoLoginDTO extends DTO {
	public static url = '/auth/auto-login';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Auth_AutoLoginRequestBodyDTO,
		public responseDTO: Auth_AutoLoginResponseDTO
	) {
		super();
	}
}

