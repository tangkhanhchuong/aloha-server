import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { DATE_REGEXP } from 'shared/business/date';
import { UserGenders } from 'shared/business/user/user';

import {
    DTO,
    HttpMethod
} from '../base.dto';

export class User_UpdateMyProfileRequestBodyDTO {
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
    @IsOptional()
    bio?: string;
    
    @IsString()
    @IsOptional()
    location?: string;
    
    @IsString()
    @IsOptional()
    website?: string;
    
    @Expose()
    @IsString()
    @IsOptional()
	@Matches(DATE_REGEXP, { message: 'Invalid date' })
    birthday?: string;
    
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
