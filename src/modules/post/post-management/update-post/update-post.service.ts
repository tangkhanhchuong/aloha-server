import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media } from 'database/media/media';
import { Post } from 'database/post/post';
import { AuthUserPayload } from 'shared/business/auth/auth-user';
import {
    Post_UpdatePostRequestBodyDTO,
    Post_UpdatePostResponseDTO,
} from 'shared/dto/post/update-post.dto';

@Injectable()
export class Post_UpdatePostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
    ) {}
    
    async execute(
        id: string,
        dto: Post_UpdatePostRequestBodyDTO,
        authUser: AuthUserPayload
    ): Promise<Post_UpdatePostResponseDTO> {
        const { content, media } = dto;

        const updatedPost = await this.postModel.updateOne(
            { id },
            { content, media, updatedBy: authUser.userId }
        );

		return { id: updatedPost.upsertedId.toString() }
	}
}
