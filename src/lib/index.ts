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
		body: Record<string, undefined> | null = null
	): Promise<T> {
		const url = this.buildUrl(primaryRoute, path, params, query);
		return await fetch(url, {
			method: method,
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: body ? JSON.stringify(body) : undefined
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
		body: Record<string, undefined> = {}
	): Promise<T> {
		return this.request<T>('POST', primaryRoute, path, accessToken, params, query, body);
	}

	async put<T>(
		primaryRoute: string,
		path: string,
		accessToken: string,
		params: Array<string> = [],
		query: Record<string, string> = {},
		body: Record<string, undefined> = {}
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

interface SortCriterion<T> {
	key: keyof T;
	direction?: SortDirection;
}

export function sortByProperties<T>(records: T[], criteria: SortCriterion<T>[]): T[] {
	return [...records].sort((a, b) => {
		for (const criterion of criteria) {
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

interface SearchCriterion<T> {
	key: keyof T;
	value: string; // The substring to search for.
}

export function filterByProperties<T>(records: T[], criteria: SearchCriterion<T>[]): T[] {
	const activeCriteria = criteria.filter((c) => c.value);

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
