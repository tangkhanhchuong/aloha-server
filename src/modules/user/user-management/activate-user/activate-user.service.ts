import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Schema as MongooseSchema } from 'mongoose';

import { User } from 'database/user/user';
import { UserStatus } from 'shared/constants/user';
import { User_ActivateUserResponseDTO } from 'shared/dto/user/activate-user.dto';

@Injectable()
export class ActivateUserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async execute(userId: string, updatedBy?: string): Promise<User_ActivateUserResponseDTO> {
        try {
            if (!isValidObjectId(userId)
                || (updatedBy && !isValidObjectId(updatedBy))
            ) {
                throw new BadRequestException('Invalid userId or updatedBy');
            }

            const user = await this.userModel.findOne({ _id: userId });
            if (!user) {
                throw new BadRequestException('User not found');
            }
            user.status = UserStatus.ACTIVE;
            if (user.updatedBy) {
                user.updatedBy = new MongooseSchema.Types.ObjectId(updatedBy);
            }
            await user.save();

            return {
                status: true
            }
        } catch (err) {
            return {
                status: false
            }
        }
	}
}
