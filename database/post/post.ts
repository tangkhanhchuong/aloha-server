import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { PostStatuses } from 'shared/business/post/post';

@Schema({ versionKey: false, collection: 'posts' })
export class Post extends Document<number> {
	@Prop({
		type: String,
		required: true,
	})
	content: string;

	@Prop({
		type: [String],
	})
	files: string[];

	@Prop({
		enum: PostStatuses,
		default: PostStatuses.PUBLISHED,
	})
	status: PostStatuses;

	@Prop({
		type: Number,
		default: 0
	})
	numberOfComments: number;

	@Prop({
		type: Number,
		default: 0
	})
	numberOfReactions: number;

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

export const PostSchema = SchemaFactory.createForClass(Post);
