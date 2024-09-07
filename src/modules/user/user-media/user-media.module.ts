import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Media, MediaSchema } from 'database/media/media';
import { User, UserSchema } from 'database/user/user';
import { MediaMapper } from 'shared/mappers/media.mapper';
import { UserMapper } from 'shared/mappers/user.mapper';
import { MediaModule } from 'src/modules/media/media.module';

import { GetUserMediaController } from './get-user-media/get-user-media.controller';
import { GetUserMediaService } from './get-user-media/get-user-media.service';

@Module({
	imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
        MediaModule
    ],
    controllers: [GetUserMediaController],
    providers: [GetUserMediaService, MediaMapper, UserMapper, Logger],
	exports: [GetUserMediaService]
})
export class UserMediaModule {}
