import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RmqModule } from 'core/rmq/rmq.module';
import { User, UserSchema } from 'database/user/user';

import { ActivateUserService } from './activate-user/activate-user.service';
import { CreateUserController } from './create-user/create-user.controller';
import { CreateUserService } from './create-user/create-user.service';
import { FindUsersController } from './find-users/find-users.controller';
import { FindUsersService } from './find-users/find-users.service';
import { SearchUsersController } from './search-users/search-users.controller';
import { SearchUsersService } from './search-users/search-users.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		RmqModule,
	],
	controllers: [
		CreateUserController,
		SearchUsersController,
		FindUsersController
	],
	providers: [
		CreateUserService,
		SearchUsersService,
		FindUsersService,
		ActivateUserService,
		Logger
	],
	exports: [
		CreateUserService,
		SearchUsersService,
		FindUsersService,
		ActivateUserService
	],
})
export class UserManagementModule {}
