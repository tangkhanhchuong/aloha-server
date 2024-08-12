import { Logger, Module } from '@nestjs/common';

import { AWSModule } from 'core/aws/aws.module';
import { RmqModule } from 'core/rmq/rmq.module';
import { Services } from 'shared/constants/microservice';

import { UserModule } from '../user/user.module';
import { ChangePasswordController } from './change-password/change-password.controller';
import { ChangePasswordService } from './change-password/change-password.service';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';

@Module({
    imports: [
        AWSModule,
		RmqModule.register({
            name: Services.USER_SERVICE,
        }),
        UserModule
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
    ]
})
export class AuthModule {}
