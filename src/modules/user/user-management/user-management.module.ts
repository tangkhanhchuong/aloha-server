import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RmqModule } from 'core/rmq/rmq.module';
import { User, UserSchema } from 'database/user/user';

import { RequestUserRelationModule } from 'shared/request/request-user-relation/request.user-relation.module';
import { CreateUserController } from './create-user/create-user.controller';
import { CreateUserService } from './create-user/create-user.service';
import { SearchUsersController } from './search-users/search-users.controller';
import { SearchUsersService } from './search-users/search-users.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		RmqModule,
		RequestUserRelationModule
	],
	controllers: [
		CreateUserController,
		SearchUsersController
	],
	providers: [
		CreateUserService,
		SearchUsersService,
		Logger
	],
	exports: [
		CreateUserService,
		SearchUsersService
	],
})
export class UserManagementModule {}
