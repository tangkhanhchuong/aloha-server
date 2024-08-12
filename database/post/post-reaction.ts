import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PostReactions {
	LIKE = 'like',
    DISLIKE = 'dislike',
    LOVE = 'love',
    HAHA = 'haha',
    WOW = 'wow',
    SAD = 'sad',
    ANGRY = 'angry',
}

@Schema({ versionKey: false })
export class PostReaction extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Post',
		required: true
	})
	postId: MongooseSchema.Types.ObjectId;

	@Prop({
		type: String,
		enum: PostReactions,
		required: true
	})
	reaction: PostReactions;
    
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

export const PostReactionSchema = SchemaFactory.createForClass(PostReaction);
