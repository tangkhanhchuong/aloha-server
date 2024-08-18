import { Injectable } from "@nestjs/common";

import { User } from "database/user/user";
import { UserDTO } from "shared/dto/user/user.dto";
import { GenerateSignedUrlsService } from "src/modules/media/generate-signed-urls/generate-signed-urls.service";

@Injectable()
export class UserMapper {
	constructor(
		private readonly generateSignedUrlsService: GenerateSignedUrlsService,
    ) {}
    
    async entityToDTO(user: User): Promise<UserDTO> {
        const userDTO: UserDTO = {
            userId: user.id,
            email: user.email,
            username: user.username,
        };
        if (user.avatar) {
            const files = await this.generateSignedUrlsService
                .generateDownloadSignedUrl({ fileKeys: [user.avatar] });
            userDTO['avatar'] = files.urls[0]
        }
        return userDTO;
    }
}