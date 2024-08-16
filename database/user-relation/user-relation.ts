import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { UserRelations } from 'shared/constants/user';

@Schema({ versionKey: false, collection: 'user-relations' })
export class UserRelation extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	targetId: MongooseSchema.Types.ObjectId;

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

export const UserRelationSchema = SchemaFactory.createForClass(UserRelation);
