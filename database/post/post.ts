import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
	updatedBy: string;

	@Prop({
		type: Date,
		default: Date.now,
	})
	deletedAt: Date;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
	})
	deletedBy: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
