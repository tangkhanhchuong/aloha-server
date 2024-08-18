import { Injectable } from "@nestjs/common";

import { PostComment } from "database/post-comment/post-comment";
import { User } from "database/user/user";
import { CommentDTO } from "shared/dto/post-comment/comment.dto";

import { UserMapper } from "./user.mapper";

@Injectable()
export class CommentMapper {
	constructor(
        private readonly userMapper: UserMapper,
    ) {}
    
    async entityToDTO(comment: PostComment & { createdBy: User }): Promise<CommentDTO> {
        const createdBy = await this.userMapper.entityToDTO(comment.createdBy); 
        const commentDTO: CommentDTO = {
            content: comment.content,
            type: comment.type,
            createdAt: comment.createdAt.toISOString(),
            createdBy
        };
        return commentDTO;
    }
}