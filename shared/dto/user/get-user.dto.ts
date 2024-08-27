import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { DTO, HttpMethod } from '../base.dto';

export class Auth_GetUserResponseDTO {
    @IsString()
    userId: string;

    @IsString()
    fullname: string;
    
    @IsString()
    username: string;

    @IsString()
    mobile: string;

    @IsString()
    avatar: string;

    @IsString()
    cover: string;
    
    @IsString()
    bio: string;
    
    @IsString()
    location: string;
    
    @IsString()
    website: string;
    
    @IsString()
    birthday: string;
    
    @IsString()
    gender: string;
    
    @IsString()
    joinedAt: string;

    @IsNumber()
    numberOfPosts: number;

    @IsNumber()
    numberOfFollowers: number;

    @IsNumber()
    numberOfFollowees: number;
}

export class Auth_GetUserRequestParamDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class Auth_GetUserDTO extends DTO {
	public static url = '/users/:userId';
	public method = HttpMethod.GET;

	public queryDTO: undefined;
	public bodyDTO: undefined;

    constructor(
        public paramDTO: Auth_GetUserRequestParamDTO,
		public responseDTO: Auth_GetUserResponseDTO
	) {
		super();
	}
}
