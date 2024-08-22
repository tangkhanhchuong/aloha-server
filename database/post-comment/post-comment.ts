import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { CommentTypes } from 'shared/business/comment/comment';

@Schema({ versionKey: false, collection: 'post-comments' })
export class PostComment extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Post',
		required: true
	})
	post: MongooseSchema.Types.ObjectId;

	@Prop({
		type: String,
		default: 'Comment content',
	})
	content: string;
	
	@Prop({
		enum: CommentTypes,
		default: CommentTypes.TEXT
	})
	type: CommentTypes;
    
	@Prop({
		type: Date,
		default: Date.now,
	})
	createdAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	createdBy: string;

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

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
