export interface Item {
	title: string;
	selected: boolean;
}

export interface Section {
	title: string;
	open: boolean;
	items: Array<Item>;
}
