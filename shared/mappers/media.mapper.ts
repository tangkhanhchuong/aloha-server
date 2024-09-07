import { Injectable } from "@nestjs/common";

import { Post } from "database/post/post";
import { User } from "database/user/user";
import { PostDTO } from "shared/dto/post/post.dto";
import { GenerateSignedUrlsService } from "src/modules/media/generate-signed-urls/generate-signed-urls.service";

import { UserMapper } from "./user.mapper";
import { Media } from "database/media/media";
import { MediaDTO } from "shared/dto/media/media.dto";

@Injectable()
export class MediaMapper {
	constructor(
        private readonly generateSignedUrlsService: GenerateSignedUrlsService,
        private readonly userMapper: UserMapper,
    ) {}
    
    async entityToDTO(media: Media & { createdBy: User }): Promise<MediaDTO> {
        const fileUrls = await this.generateSignedUrlsService
            .generateDownloadSignedUrl({ fileNames: [media.key] });
        const createdBy = await this.userMapper.entityToDTO(media.createdBy);

        const mediaDTO: MediaDTO = {
            createdBy,
            url: fileUrls[0],
            createdAt: media.createdAt.toISOString()
        };
        return mediaDTO;
    }
}