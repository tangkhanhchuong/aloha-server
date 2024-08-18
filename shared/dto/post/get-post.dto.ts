
import { DTO, HttpMethod } from '../base.dto';
import { PostDTO } from './post.dto';

export class Post_GetPostResponseDTO extends PostDTO {};

export class Post_GetPostDTO extends DTO {
	public static url = '/posts/:id';
	public method = HttpMethod.GET;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public bodyDTO: undefined

	constructor(
		public responseDTO: Post_GetPostResponseDTO
	) {
		super();
	}
}
