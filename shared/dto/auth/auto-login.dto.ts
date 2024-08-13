import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { DTO, HttpMedthod } from "../base.dto";

export class Auth_AutoAuthLoginRequestBodyDTO {
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
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Auth_AutoAuthLoginRequestBodyDTO,
		public responseDTO: Auth_AutoLoginResponseDTO
	) {
		super();
	}
}

