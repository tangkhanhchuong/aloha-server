import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'database/user/user';
import { UserRelations } from 'shared/business/user/user';

@Schema({ versionKey: false, collection: 'user-relations' })
export class UserRelation extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	target: MongooseSchema.Types.ObjectId | User;

	@Prop({
		enum: UserRelations,
		default: UserRelations.FOLLOW
	})
	relationType: UserRelations;

	@Prop({
		type: Date,
		default: Date.now,
	})
	createdAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	createdBy: MongooseSchema.Types.ObjectId | User;

	@Prop({
		type: Date,
		default: Date.now,
	})
	updatedAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	updatedBy: MongooseSchema.Types.ObjectId | User;

	@Prop({
		type: Date,
		default: Date.now,
	})
	deletedAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	deletedBy: MongooseSchema.Types.ObjectId | User;
}

export const UserRelationSchema = SchemaFactory.createForClass(UserRelation);
