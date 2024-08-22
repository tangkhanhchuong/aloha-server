import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

import { AuthUserPayload } from 'shared/business/auth/auth-user';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUserPayload => {
	const request = ctx.switchToHttp().getRequest();
	const requestUser = request.user;
	if (!isMongoId(requestUser.userId)) {
		throw new UnauthorizedException();
	}
	return requestUser;
});
