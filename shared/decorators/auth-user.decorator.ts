import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class AuthUserPayload {
	userId: string;
	email: string;
}

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUserPayload => {
	const request = ctx.switchToHttp().getRequest();
	const requestUser = request.user;
	console.log({requestUser})
	if (!isMongoId(requestUser.userId)) {
		throw new UnauthorizedException();
	}
	return {
		userId: requestUser.userId,
		email: requestUser.email,
	};
});
