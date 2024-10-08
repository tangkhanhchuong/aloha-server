import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'database/user/user';
import { UserMapper } from 'shared/mappers/user.mapper';
import { MediaModule } from 'src/modules/media/media.module';

import { GetUserMediaService } from '../user-media/get-user-media/get-user-media.service';
import { ActivateUserService } from './activate-user/activate-user.service';
import { CreateUserController } from './create-user/create-user.controller';
import { CreateUserService } from './create-user/create-user.service';
import { FindUsersController } from './find-users/find-users.controller';
import { FindUsersService } from './find-users/find-users.service';
import { GetUserController } from './get-user/get-user.controller';
import { GetUserService } from './get-user/get-user.service';
import { SearchUsersController } from './search-users/search-users.controller';
import { SearchUsersService } from './search-users/search-users.service';
import { UpdateMyProfileController } from './update-my-profile/update-my-profile.controller';
import { UpdateMyProfileService } from './update-my-profile/update-my-profile.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MediaModule
	],
	controllers: [
		CreateUserController,
		SearchUsersController,
		FindUsersController,
		GetUserController,
		UpdateMyProfileController,
		GetUserController,
	],
	providers: [
		CreateUserService,
		SearchUsersService,
		FindUsersService,
		ActivateUserService,
		GetUserService,
		UpdateMyProfileService,
		GetUserService,
		UserMapper,
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
