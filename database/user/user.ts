import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { UserStatuses } from 'shared/constants/user';

@Schema({ versionKey: false, collection: 'users' })
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
		enum: UserStatuses,
		default: UserStatuses.INACTIVE
	})
	status: UserStatuses;

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

	activate: Function;
	deactivate: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.activate = async function(): Promise<void> {
	this.status = UserStatuses.ACTIVE;
	this.save();
}

UserSchema.methods.deactivate = async function(): Promise<void> {
	this.status = UserStatuses.INACTIVE;
	this.save();
}

