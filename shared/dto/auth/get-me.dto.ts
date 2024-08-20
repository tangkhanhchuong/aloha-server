import { DTO, HttpMethod } from '../base.dto';
import { UserDTO } from '../user/user.dto';

export class Auth_GetMeResponseDTO extends UserDTO {}

export class Auth_GetMeDTO extends DTO {
	public static url = '/me';
	public method = HttpMethod.GET;

	public queryDTO: undefined;
	public paramDTO: undefined;
	public bodyDTO: undefined;

	constructor(
		public responseDTO: Auth_GetMeResponseDTO
	) {
		super();
	}
}
