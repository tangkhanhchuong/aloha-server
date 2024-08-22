export class UserSessionPayload {
	cognitoId?: string;
	userId?: string;
	email?: string;
	username?: string;
	avatar?: string;
    socketIds?: string[];
}