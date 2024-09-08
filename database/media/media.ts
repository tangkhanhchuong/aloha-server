import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum MediaTypes {
	IMAGE = "IMAGE"
}

@Schema({ versionKey: false, collection: 'media' })
export class Media extends Document<number> {
    @Prop({
        type: String,
        required: true
    })
	key: string;

	@Prop({
        enum: MediaTypes,
        required: true
    })
    type: MediaTypes;

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

export const MediaSchema = SchemaFactory.createForClass(Media);
