import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'database/user/user';

import { UserManagementModule } from './user-management/user-management.module';
import { UserMediaModule } from './user-media/user-media.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		UserManagementModule,
		UserSettingsModule,
		UserMediaModule
	],
	exports: [
		UserManagementModule,
		UserSettingsModule,
		UserMediaModule
	]
})
export class UserModule {}
