import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const UserRelation_IntializeUserRelationURL = 'user-relation/initialize-user-relation';

export class UserRelation_IntializeUserRelationRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;
}

export class UserRelation_IntializeUserRelationResponseDTO {
	@IsString()
	userId: string;
}
