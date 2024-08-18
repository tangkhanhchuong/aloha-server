import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CognitoModule } from 'core/aws/cognito/cognito.module';
import { User, UserSchema } from 'database/user/user';
import { UserMapper } from 'shared/mappers/user.mapper';

import { ChangePasswordController } from './change-password/change-password.controller';
import { ChangePasswordService } from './change-password/change-password.service';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }
        ]),
        CognitoModule,
        MediaModule
    ],
    controllers: [
        ChangePasswordController,
        ForgotPasswordController,
        LoginController,
        RegisterController,
    ],
    providers: [
        Logger,
        ChangePasswordService,
        ForgotPasswordService,
        LoginService,
        RegisterService,
        UserMapper
    ]
})
export class AuthModule {}
