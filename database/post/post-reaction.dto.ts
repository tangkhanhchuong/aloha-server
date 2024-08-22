import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { PostReactions } from 'shared/business/post/post';

@Schema({ versionKey: false, collection: 'post-reactions' })
export class PostReaction extends Document<number> {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Post',
	})
    postId: MongooseSchema.Types.ObjectId;
    
    @Prop({
        enum: PostReactions,
    })
    reactionType: PostReactions;

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

export const PostReactionSchema = SchemaFactory.createForClass(PostReaction);
