import { Injectable } from "@nestjs/common";

import { User } from "database/user/user";
import { UserDTO } from "shared/dto/user/user.dto";
import { GenerateSignedUrlsService } from "src/modules/media/generate-signed-urls/generate-signed-urls.service";

@Injectable()
export class UserMapper {
	constructor(
		private readonly generateSignedUrlsService: GenerateSignedUrlsService,
    ) {}
    
    async entityToDTO(user: User & { isFollowed?: boolean }): Promise<UserDTO> {
        const userDTO: UserDTO = {
            isFollowed: user.isFollowed,
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            fullname: user.profile.fullname,
            bio: user.profile.bio
        };
        if (user.avatar) {
            const files = await this.generateSignedUrlsService
                .generateDownloadSignedUrl({ fileKeys: [user.avatar] });
            userDTO['avatar'] = files.urls[0]
        }
        return userDTO;
    }
}