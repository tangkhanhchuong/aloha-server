export class ListingResponse<T> {
	items: T[];
	count: number;

	constructor(result: [T[], number]) {
		(this.items = result[0]), (this.count = result[1]);
	}
}
