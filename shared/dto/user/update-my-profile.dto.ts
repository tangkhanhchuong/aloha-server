import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

import { DATE_REGEXP } from 'shared/business/date';
import { UserGenders } from 'shared/business/user/user';

import {
    DTO,
    HttpMethod
} from '../base.dto';
import { Expose } from 'class-transformer';

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
    
    @Expose()
    @IsNotEmpty()
    @IsOptional()
	@Matches(DATE_REGEXP, { message: 'Invalid date' })
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
