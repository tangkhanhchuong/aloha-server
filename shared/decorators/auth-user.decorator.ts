import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class AuthUserPayload {
	userId: string;
	email: string;
}

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUserPayload => {
	const request = ctx.switchToHttp().getRequest();
	const headers = request.headers;
	return {
		userId: headers.userid,
		email: headers.email,
	};
});
