import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PostStatus {
	DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

@Schema({ versionKey: false })
export class Post extends Document<number> {
	@Prop({
		type: String,
		required: true,
	})
	title: string;

	@Prop({
		type: String,
		required: true,
	})
	content: string;

	@Prop({
		type: [String],
	})
	media: string[];

	@Prop({
		enum: PostStatus,
		default: PostStatus.DRAFT,
	})
	status: PostStatus;

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
