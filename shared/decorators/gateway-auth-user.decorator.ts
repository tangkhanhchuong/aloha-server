import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GatewayAuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const headers = request.headers;
	return {
		userId: headers.userid,
		email: headers.email,
	};
});
