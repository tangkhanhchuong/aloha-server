import { IsBoolean, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { UserGenders } from 'shared/business/user/user';

import {
    DTO,
    HttpMethod
} from '../base.dto';

export class User_UpdateMyProfileRequestBodyDTO {
	@IsString()
    @MaxLength(25)
    @IsNotEmpty()
    @IsOptional()
	username?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    avatar?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    cover?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    fullname?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    bio?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    location?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    website?: string;
    
    @IsISO8601()
    @IsNotEmpty()
    @IsOptional()
    birthday?: Date;
    
    @IsEnum(UserGenders)
    @IsNotEmpty()
    @IsOptional()
	gender?: UserGenders;
}

export class User_UpdateMyProfileResponseDTO {
	@IsBoolean()
	status: boolean;
}

export class User_UpdateMyProfileDTO extends DTO {
	public static url = '/me/profile';
	public method = HttpMethod.PATCH;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: User_UpdateMyProfileRequestBodyDTO,
		public responseDTO: User_UpdateMyProfileResponseDTO
	) {
		super();
	}
}
