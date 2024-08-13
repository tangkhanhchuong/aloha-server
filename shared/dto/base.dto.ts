export enum HttpMedthod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE"
}

export abstract class DTO {
    public static readonly url: string;
	public abstract readonly HttpMedthod: HttpMedthod;
	public abstract queryDTO: unknown;
	public abstract bodyDTO: unknown;
	public abstract paramDTO: unknown;
	public abstract responseDTO: unknown;
	public headers?: Record<string, string>;
}