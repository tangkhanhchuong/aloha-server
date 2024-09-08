import { Injectable } from "@nestjs/common";

import { Media } from "database/media/media";
import { User } from "database/user/user";
import { MediaDTO } from "shared/dto/media/media.dto";
import { GenerateSignedUrlsService } from "src/modules/media/generate-signed-urls/generate-signed-urls.service";

import { UserMapper } from "./user.mapper";

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
            mediaId: media._id.toString(),
            url: fileUrls.files[0].url,
            type: media.type, 
            createdAt: media.createdAt.toISOString()
        };
        return mediaDTO;
    }
}