type TBody = Record<string, object | string | number | boolean | undefined | null>;

export class CSRequest {
	constructor(public backendUrl: string) {}

	private buildUrl(
		host: string,
		path: string,
		params: Array<string> = [],
		query: Record<string, string> = {}
	) {
		// Asegurar que las barras estén correctamente colocadas
		const baseUrl = this.backendUrl.endsWith('/') ? this.backendUrl.slice(0, -1) : this.backendUrl;
		const hostPath = host.startsWith('/') ? host : '/' + host;
		const pathPart = path.startsWith('/') ? path : '/' + path;

		let url = baseUrl + hostPath + pathPart;

		if (params && params.length > 0) {
			url += '/' + params.join('/');
		}
		if (query && Object.keys(query).length > 0) {
			url += '?' + new URLSearchParams(query).toString();
		}
		return url;
	}

	async request<T>(
		method: string,
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {},
		body: TBody | undefined = undefined
	): Promise<T> {
		const url = this.buildUrl(primaryRoute, path, params, query);
		return await fetch(url, {
			method: method,
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: body ? JSON.stringify(body) : body
		}).then((response) => response.json());
	}

	async get<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params?: Array<string>,
		query?: Record<string, string>
	): Promise<T> {
		return this.request<T>('GET', primaryRoute, path, accessToken, params, query);
	}

	async post<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {},
		body: TBody = {}
	): Promise<T> {
		return this.request<T>('POST', primaryRoute, path, accessToken, params, query, body);
	}

	async put<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {},
		body: TBody = {}
	): Promise<T> {
		return this.request<T>('PUT', primaryRoute, path, accessToken, params, query, body);
	}

	async delete<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {}
	): Promise<T> {
		return this.request<T>('DELETE', primaryRoute, path, accessToken, params, query);
	}

	async patch<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {},
		body: Record<string, undefined> = {}
	): Promise<T> {
		return this.request<T>('PATCH', primaryRoute, path, accessToken, params, query, body);
	}

	async options<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {}
	): Promise<T> {
		return this.request<T>('OPTIONS', primaryRoute, path, accessToken, params, query);
	}
}

export enum SortDirection {
	ASC = 'asc',
	DESC = 'desc'
}

export interface SortCriterion<T> {
	key: keyof T;
	direction: SortDirection;
}

export type SortCriteria = Record<string, SortDirection>;

export function addSort(sortCriteria: SortCriteria, key: string, direction: SortDirection) {
	if (sortCriteria[key] === direction.toLowerCase()) {
		delete sortCriteria[key];
	} else {
        sortCriteria[key] = direction;
	}
}

export function sortByProperties<T>(records: T[], sortCriteria: SortCriteria): T[] {
	const sortCriterion = Object.entries(sortCriteria).map(([key, value]) => ({
		key: key as keyof T,
		direction: value
	}));

	return [...records].sort((a, b) => {
		for (const criterion of sortCriterion) {
			const { key, direction = 'asc' } = criterion;
			const valueA = a[key];
			const valueB = b[key];

			// Use a comparison factor to easily flip the result for descending order
			const sortOrder = direction === 'asc' ? 1 : -1;

			if (valueA < valueB) {
				return -1 * sortOrder;
			}
			if (valueA > valueB) {
				return 1 * sortOrder;
			}
		}
		return 0;
	});
}

export type FilterCriteria = Record<string, string>;

export function addFilter(filterCriteria: FilterCriteria, key: string, value: string) {
	if (value === '') {
		delete filterCriteria[key];
	} else {
		filterCriteria[key] = value;
	}
}

export function filterByCriteria<T>(records: T[], filterCriteria: FilterCriteria): T[] {
	const searchCriterion = Object.entries(filterCriteria).map(([key, value]) => ({
		key: key as keyof T,
		value: value
	}));

	const activeCriteria = searchCriterion.filter((c) => c.value);

	if (activeCriteria.length === 0) {
		return records; // Return all records if no active criteria
	}

	return records.filter((record) => {
		return activeCriteria.every((criterion) => {
			const { key, value: searchTerm } = criterion;
			const recordValue = record[key];

			const recordValueString = String(recordValue ?? '').toLowerCase();
			const searchTermString = searchTerm.toLowerCase();

			return recordValueString.includes(searchTermString);
		});
	});
}

export class StringUtils {
	static capitilize(str: string, sep: string = ' ', join: string = ' ') {
		return str
			.split(sep)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(join);
	}
}

export function formatCop(v: number) {
	return Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 2
	}).format(v);
}

export function formatDate(date: Date, hora: boolean = false) {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	let options = {};
	if (hora) {
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		};
	} else {
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};
	}

	return date.toLocaleDateString('es-CO', options);
}

export function startEndMonth(date: Date) {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
}

export function alfanumericRandom(length = 16) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, length);
}