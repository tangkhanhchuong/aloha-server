import { Injectable } from "@nestjs/common";

import { Post } from "database/post/post";
import { User } from "database/user/user";
import { PostDTO } from "shared/dto/post/post.dto";
import { GenerateSignedUrlsService } from "src/modules/media/generate-signed-urls/generate-signed-urls.service";

import { UserMapper } from "./user.mapper";

@Injectable()
export class PostMapper {
	constructor(
        private readonly generateSignedUrlsService: GenerateSignedUrlsService,
        private readonly userMapper: UserMapper,
    ) {}
    
    async entityToDTO(post: Post & { createdBy: User }): Promise<PostDTO> {
        const fileUrls = await this.generateSignedUrlsService
            .generateDownloadSignedUrl({ fileKeys: post.files });
        const createdBy = await this.userMapper.entityToDTO(post.createdBy); 
        const postDTO: PostDTO = {
            postId: post.id,
            fileUrls: fileUrls.urls,
            content: post.content,
            title: post.title,
            numberOfReactions: post.numberOfReactions,
            numberOfComments: post.numberOfComments,
            createdAt: post.createdAt.toISOString(),
            createdBy
        };
        return postDTO;
    }
}