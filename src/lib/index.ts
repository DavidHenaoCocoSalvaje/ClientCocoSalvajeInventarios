type TBody = Record<string, object | string | number | boolean | undefined | null> | FormData;

export interface ApiResponse<T> {
	ok: boolean;
	status: number;
	data?: T;
	error?: string;
}

export interface RequestOptions {
	method: string;
	primaryRoute: string;
	path: string;
	accessToken: string;
	params?: string[];
	query?: Record<string, string>;
	body?: TBody;
}

export interface MethodOptions {
	primaryRoute: string;
	path: string;
	accessToken: string;
	params?: string[];
	query?: Record<string, string>;
	body?: TBody;
}

// Helper specific to get/delete/options which typically don't have a body,
// although the main request method supports it.
export interface NoBodyMethodOptions {
	primaryRoute: string;
	path: string;
	accessToken: string;
	params?: string[];
	query?: Record<string, string>;
}

function getErrorMessage(status: number, detail?: string): string {
	if (detail) return detail;
	switch (status) {
		case 401: return 'No autorizado. Tu sesión puede haber expirado.';
		case 403: return 'No tienes permisos para acceder a este recurso.';
		case 404: return 'Recurso no encontrado.';
		case 500: return 'Error interno del servidor.';
		default: return `Error del servidor (${status})`;
	}
}

export type MessageType = 'error' | 'info' | 'warning';

export function getMessageType(status: number): MessageType {
	if (status === 401 || status === 403) return 'info';
	if (status >= 400 && status < 500) return 'warning';
	return 'error';
}

export class CSRequest {
	constructor(public backendUrl: string) { }

	private buildUrl({
		host,
		path,
		params,
		query
	}: {
		host: string;
		path: string;
		params?: string[];
		query?: Record<string, string>;
	}) {
		const baseUrl = this.backendUrl.replace(/\/+$/, '');
		const hostPath = host.replace(/^\/+/, '');
		const pathPart = path.replace(/^\/+/, '');

		const url = new URL(`${baseUrl}/${hostPath}/${pathPart}`);

		if (params && params.length > 0) {
			url.pathname += '/' + params.join('/');
		}

		if (query) {
			Object.entries(query).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		return url.toString();
	}

	async request<T>({
		method,
		primaryRoute,
		path,
		accessToken,
		params,
		query,
		body
	}: RequestOptions): Promise<ApiResponse<T>> {
		const url = this.buildUrl({ host: primaryRoute, path, params, query });

		try {
			const response = await fetch(url, {
				method,
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: body ? JSON.stringify(body) : undefined
			});

			const json = await response.json();

			if (!response.ok) {
				return {
					ok: false,
					status: response.status,
					error: getErrorMessage(response.status, json?.detail)
				};
			}

			return {
				ok: true,
				status: response.status,
				data: json as T
			};
		} catch (err) {
			return {
				ok: false,
				status: 0,
				error: 'Error de conexión. Verifica tu red.'
			};
		}
	}

	async get<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query
	}: NoBodyMethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'GET',
			primaryRoute,
			path,
			accessToken,
			params,
			query
		});
	}

	async post<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query,
		body = {}
	}: MethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'POST',
			primaryRoute,
			path,
			accessToken,
			params,
			query,
			body
		});
	}

	async put<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query,
		body = {}
	}: MethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'PUT',
			primaryRoute,
			path,
			accessToken,
			params,
			query,
			body
		});
	}

	async delete<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query
	}: NoBodyMethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'DELETE',
			primaryRoute,
			path,
			accessToken,
			params,
			query
		});
	}

	async patch<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query,
		body = {}
	}: MethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'PATCH',
			primaryRoute,
			path,
			accessToken,
			params,
			query,
			body
		});
	}

	async options<T>({
		primaryRoute,
		path,
		accessToken,
		params,
		query
	}: NoBodyMethodOptions): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'OPTIONS',
			primaryRoute,
			path,
			accessToken,
			params,
			query
		});
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

type AddSortParams = { sortCriteria: SortCriteria; key: string; direction: SortDirection }
export function addSort({ sortCriteria, key, direction }: AddSortParams) {
	if (sortCriteria[key] === direction.toLowerCase()) {
		delete sortCriteria[key];
	} else {
		sortCriteria[key] = direction;
	}
}

type SortByPropertiesParams<T> = { records: T[]; sortCriteria: SortCriteria }
export function sortByProperties<T>({ records, sortCriteria }: SortByPropertiesParams<T>): T[] {
	const sortCriterion = Object.entries(sortCriteria).map(([key, value]) => ({
		key: key as keyof T,
		direction: value
	}));

	return [...records].sort((a, b) => {
		for (const criterion of sortCriterion) {
			const { key, direction = 'asc' } = criterion;
			const valueA = a[key];
			const valueB = b[key];

			const sortOrder = direction === 'asc' ? 1 : -1;

			if (valueA < valueB) return -1 * sortOrder;
			if (valueA > valueB) return 1 * sortOrder;
		}
		return 0;
	});
}

export type FilterCriteria = Record<string, string>;

type AddFilterParams = { filterCriteria: FilterCriteria; key: string; value: string }
export function addFilter({ filterCriteria, key, value }: AddFilterParams) {
	if (value === '') {
		delete filterCriteria[key];
	} else {
		filterCriteria[key] = value;
	}
}

type FilterByCriteriaParams<T> = { records: T[]; filterCriteria: FilterCriteria }
export function filterByCriteria<T>({ records, filterCriteria }: FilterByCriteriaParams<T>): T[] {
	const activeCriteria = Object.entries(filterCriteria).filter(([, value]) => value);

	if (activeCriteria.length === 0) return records;

	return records.filter((record) => {
		return activeCriteria.every(([key, searchTerm]) => {
			const recordValue = record[key as keyof T];
			const recordValueString = String(recordValue ?? '').toLowerCase();
			return recordValueString.includes(searchTerm.toLowerCase());
		});
	});
}

type CapitalizeParams = { str: string; sep?: string; join?: string }
export class StringUtils {
	static capitilize({ str, sep = ' ', join: joinStr = ' ' }: CapitalizeParams) {
		return str
			.split(sep)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(joinStr);
	}
}

type FormatCopParams = { value: number }
export function formatCop({ value }: FormatCopParams) {
	return Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 2
	}).format(value);
}

type FormatDateParams = { date: Date | string; hora?: boolean }
export function formatDate({ date, hora = false }: FormatDateParams) {
	const d = typeof date === 'string' ? new Date(date) : date;

	const options: Intl.DateTimeFormatOptions = hora
		? {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}
		: {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};

	return d.toLocaleDateString('es-CO', options);
}

type StartEndMonthStringParams = { date: Date | string }
export function startEndMonthString({ date }: StartEndMonthStringParams): [string, string] {
	const d = typeof date === 'string' ? new Date(date) : date;
	const start = new Date(d.getFullYear(), d.getMonth(), 1);
	const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

	return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
}

type YearStartAndMonthEndStringParams = { date: Date | string }
export function yearStartAndMonthEndString({ date }: YearStartAndMonthEndStringParams): [string, string] {
	const d = typeof date === 'string' ? new Date(date) : date;
	const start = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
	const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

	return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
}

type AlfanumericRandomParams = { length?: number }
export function alfanumericRandom({ length = 16 }: AlfanumericRandomParams = {}) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const random = Math.random() * Date.now() * (i + 1);
		const index = Math.floor((random % 1) * chars.length);
		result += chars[index];
	}

	return result;
}
