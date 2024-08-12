import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { UserStatus } from 'shared/constants/user';

@Schema({ versionKey: false })
export class User extends Document<number> {
	@Prop({
		type: String,
		required: true,
		trim: true,
		maxlength: 25,
	})
	username: string;

	@Prop({
		type: String,
		required: true,
		trim: true,
		unique: true,
	})
	email: string;

	@Prop({
		enum: UserStatus,
		default: UserStatus.INACTIVE
	})
	status: UserStatus;

	@Prop({
		type: String,
	})
	avatar: string;

	@Prop({
		type: Date,
		default: Date.now,
	})
	createdAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	createdBy: MongooseSchema.Types.ObjectId;

	@Prop({
		type: Date,
		default: Date.now,
	})
	updatedAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	updatedBy: MongooseSchema.Types.ObjectId;

	@Prop({
		type: Date,
		default: Date.now,
	})
	deletedAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	deletedBy: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
