import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { DTO, METHOD } from "../base.dto";

export class Auth_AutoAuthLoginRequestDTO {
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
	public method = METHOD.POST;

	public queryDTO: undefined;

	constructor(
		public bodyDTO: Auth_AutoAuthLoginRequestDTO,
		public responseDTO: Auth_AutoLoginResponseDTO
	) {
		super();
	}
}

