import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from 'database/post/post';
import {
	Post_GetPostResponseDTO
} from 'shared/dto/post/get-post.dto';
import { GenerateSignedUrlsService } from 'src/modules/media/generate-signed-urls/generate-signed-urls.service';

@Injectable()
export class GetPostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly generateSignedUrlsService: GenerateSignedUrlsService
    ) {}
    
	async execute(id: string): Promise<Post_GetPostResponseDTO> {
		const foundPost: Post = await this.postModel.findById(id);

		const files = await this.generateSignedUrlsService.generateDownloadSignedUrl({
			fileKeys: foundPost.files,
		});
		return {
			fileUrls: files.urls,
			title: foundPost.title,
			content: foundPost.content,
			numberOfReactions: foundPost.numberOfReactions,
			numberOfComments: foundPost.numberOfComments,
			createdAt: foundPost.createdAt.toString(),
			createdBy: foundPost.createdBy.toString()
		}
	}
}
