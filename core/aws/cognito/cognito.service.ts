import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import {
	AuthenticationDetails,
	CognitoRefreshToken,
	CognitoUser,
	CognitoUserPool,
	CognitoUserSession,
	ISignUpResult
} from 'amazon-cognito-identity-js';

import { ConfigService } from 'core/config/config.service';

@Injectable()
export class CognitoService {
	private userPool: CognitoUserPool;

	constructor(configService: ConfigService) {
		const awsConfig = configService.getAWSConfig();
		this.userPool = new CognitoUserPool({
			UserPoolId: awsConfig.cognitoUserPoolId,
			ClientId: awsConfig.cognitoClientId,
		});
	}

	public async register(email: string, password: string): Promise<ISignUpResult> {
		return new Promise((resolve, reject) => {
			this.userPool.signUp(email, password, null, null, (err, result) => {
				if (err) {
					reject(new UnauthorizedException(err.message));
				}
				resolve(result);
			});
		});
	}

	public async confirmRegistration(email: string, otp: string) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: this.userPool,
			};
			const user = new CognitoUser(userData);
			user.confirmRegistration(otp, false, (err, result) => {
				if (err) {
					reject(new BadRequestException(err.message));
				}
				resolve(result);
			});
		});
	}

	public async resendRegistrationOTP(email: string) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: this.userPool,
			};
			const user = new CognitoUser(userData);
			user.resendConfirmationCode((err, result) => {
				if (err) {
					reject(new BadRequestException(err.message));
				}
				resolve(result);
			});
		});
	}

	public async authenticate(email: string, password: string): Promise<CognitoUserSession> {
		const userData = {
			Username: email,
			Pool: this.userPool,
		};
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password
		});

		const user = new CognitoUser(userData);
		return new Promise((resolve, reject) => {
			return user.authenticateUser(authenticationDetails, {	
				onSuccess: (result) => {
					resolve(result);
				},
				onFailure: (err) => {
					reject(new UnauthorizedException('INVALID_EMAIL_OR_PASSWORD'));
				},
			});
		});
	}

	public async refreshSession(refreshToken: string): Promise<string> {
		return new Promise((resolve, reject) => {
		const userData = {
			Username: '',
			Pool: this.userPool,
		};

		const cognitoRefreshToken = new CognitoRefreshToken({
			RefreshToken: refreshToken,
		});

		const user = new CognitoUser(userData);
		user.refreshSession(cognitoRefreshToken, (err, result) => {
			if (err) {
				reject(new UnauthorizedException(err.message));
			} else {
				resolve(result.getIdToken().getJwtToken());
			}
		});
		});
	}

	public async forgotPassword(email: string): Promise<void> {
		const userData = {
			Username: email,
			Pool: this.userPool,
		};
		const cognitoUser = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			cognitoUser.forgotPassword({
				onSuccess: () => {
					resolve();
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	public async resetPassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
		const userData = {
			Username: email,
			Pool: this.userPool,
		};
		const cognitoUser = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			cognitoUser.confirmPassword(verificationCode, newPassword, {
				onSuccess: () => {
					resolve();
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: oldPassword,
		});
		const userData = {
			Username: email,
			Pool: this.userPool,
		};
		const cognitoUser = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (session) => {
				cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
					if (err) {
						reject(new BadRequestException(err.message));
					} else {
						resolve();
					}
				});
				},
				onFailure: (err) => {
					reject(new UnauthorizedException(err.message));
				},
			});
		});
	}

	public async logout(email: string): Promise<void> {
		const userData = {
			Username: email,
			Pool: this.userPool,
		};
		const user = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			user.signOut(() => {
				resolve();
			});
		});
	}
}
