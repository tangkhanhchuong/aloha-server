import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false, collection: 'comments' })
export class PostComment extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Post',
		required: true
	})
	postId: MongooseSchema.Types.ObjectId;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'user',
		required: true
	})
	userId: MongooseSchema.Types.ObjectId;
    
	@Prop({
		type: Date,
		default: Date.now,
	})
    content: Date;
    
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
