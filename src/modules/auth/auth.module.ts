import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CognitoModule } from 'core/aws/cognito/cognito.module';
import { SessionModule } from 'core/session/session.module';
import { User, UserSchema } from 'database/user/user';
import { UserMapper } from 'shared/mappers/user.mapper';

import { MediaModule } from '../media/media.module';
import { ChangePasswordController } from './change-password/change-password.controller';
import { ChangePasswordService } from './change-password/change-password.service';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { GetMeController } from './get-me/get-me.controller';
import { GetMeService } from './get-me/get-me.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LogoutController } from './logout/logout.controller';
import { LogoutService } from './logout/logout.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';

@Module({
    imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }
        ]),
        CognitoModule,
        SessionModule,
        MediaModule
    ],
    controllers: [
        ChangePasswordController,
        ForgotPasswordController,
        LoginController,
        RegisterController,
        LogoutController,
        GetMeController,
    ],
    providers: [
        Logger,
        ChangePasswordService,
        ForgotPasswordService,
        LoginService,
        RegisterService,
        LogoutService,
        GetMeService,
        UserMapper
    ]
})
export class AuthModule {}
