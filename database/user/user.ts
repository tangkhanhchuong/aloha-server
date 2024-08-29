import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from 'database/post/post';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { UserGenders, UserStatuses } from 'shared/business/user/user';

export class UserProfile {
	cover: string = 'default-cover.png';
	bio: string = 'Hi, I am new to Aloha';
	fullname: string;
	location: string;
	website: string;
	birthday: Date;
	gender: UserGenders;
}

export class NotificationPreferences {
	EmailEnabled: boolean = false;
	SMSEnabled: boolean = false;
	PushEnabled: boolean = true;
}

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
		default: 'default-male-avatar.png'
	})
	avatar: string;

	@Prop({
		type: String,
	})
	mobile: string;

	@Prop({
		type: UserProfile,
		default: {}
	})
	profile: UserProfile;

	@Prop({
		type: Number,
		default: 0
	})
	numberOfPosts: number;

	@Prop({
		type: Number,
		default: 0
	})
	numberOfFollowers: number;

	@Prop({
		type: Number,
		default: 0
	})
	numberOfFollowees: number;

	@Prop({
		type: NotificationPreferences
	})
	notificationPreferences: NotificationPreferences;

	@Prop({
		type: [MongooseSchema.Types.ObjectId],
		ref: 'User'
	})
	blackList: MongooseSchema.Types.ObjectId[];

	@Prop({
		type: [Types.ObjectId],
		ref: 'Post'
	})
	bookmarks: Types.ObjectId[];
	
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

