import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RmqModule } from 'core/rmq/rmq.module';
import { User, UserSchema } from 'database/user/user';

import { UserManagementModule } from './user-management/user-management.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		RmqModule,
		UserManagementModule,
		UserSettingsModule
	]
})
export class UserModule {}
