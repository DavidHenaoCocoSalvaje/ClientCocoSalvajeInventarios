import { CSRequest, formatCop, formatDate, SortDirection } from '$lib';

export interface IMovimiento {
	tipo_movimiento_id: number;
	estado_variante_id: number;
	valor: number;
	soporte_id: string;
	fecha: Date;
	tipo_soporte_id: number;
	variante_id: number;
	cantidad: number;
	bodega_id: number;
	nota: null;
	id: number;
}

export interface IMovimientoFormat extends Omit<IMovimiento, 'valor' | 'fecha'> {
	valor: string;
	fecha: string;
}

export interface IVenta {
	fecha: Date;
	tipo_movimiento_id: number;
	cantidad: number;
	'cantidad_%': number;
	valor: number;
	'valor_%': number;
	sku: string;
	elemento_id: number;
	variante: string;
}

export interface IVentaFormat extends Omit<IVenta, 'valor' | 'fecha'> {
	valor: string;
	fecha: string;
}

export interface IMetadato {
	meta_atributo_id: number;
	meta_valor_id: number;
	meta_atributo: string;
	meta_valor: string;
}

export enum IFrecuencia {
	DIARIO = 'D',
	SEMANAL = 'W',
	MENSUAL = 'ME',
	ANUAL = 'Y'
}

export enum IFiltroTipoMovimiento {
	SALIDA = 'salida',
	ENTRADA = 'entrada',
	AUMENTO = 'aumento',
	DISMINUCION = 'disminucion',
	CARGUE_INICIAL = 'cargue inicial'
}

export enum IFiltroTipoSoporte {
	COMPRA = 'factura de compra',
	PEDIDO = 'pedido',
	ORDEN_PRODUCCCION = 'orden de producción',
	TRASLADO = 'traslado'
}

export class InventarioFormat {
	static movimientos(movimientos: Array<IMovimiento>) {
		return movimientos.map((movimiento: IMovimiento) => ({
			...movimiento,
			fecha: formatDate(movimiento.fecha),
			valor: formatCop(Number(movimiento.valor))
		}));
	}

	static ventas(ventas: Array<IVenta>) {
		return ventas.map((venta: IVenta) => ({
			...venta,
			fecha: formatDate(venta.fecha),
			valor: formatCop(Number(venta.valor)),
			'cantidad_%': `${venta['cantidad_%'].toFixed(3)}%`,
			'valor_%': `${venta['valor_%'].toFixed(3)}%`
		}));
	}
}

export class Movimiento {
	static async getList({
		url,
		access_token,
		skip = 0,
		limit = 100,
		sort = SortDirection.DESC
	}: {
		url: string;
		access_token: string;
		skip?: number;
		limit?: number;
		sort?: SortDirection;
	}) {
		const request = new CSRequest(url);
		return await request.get<Array<IMovimiento>>({
			primaryRoute: '/inventario',
			path: `/movimientos`,
			accessToken: access_token,
			query: {
				skip: skip.toString(),
				limit: limit.toString(),
				sort: sort
			}
		});
	}

	static async getVentasAgrupadas({
		url,
		access_token,
		start_date,
		end_date,
		sort = SortDirection.DESC,
		frequency = IFrecuencia.DIARIO,
		groupBy = ['variante_id'],
		metaValorIds = []
	}: {
		url: string;
		access_token: string;
		start_date: string;
		end_date: string;
		sort?: SortDirection;
		frequency?: IFrecuencia;
		groupBy?: Array<string>;
		metaValorIds?: Array<number>;
	}) {
		const request = new CSRequest(url);
		const body = {
			group_by: groupBy,
			meta_valor_ids: metaValorIds
		};
		return await request.post<Array<IVenta>>({
			primaryRoute: '/inventario',
			path: `/movimientos-agrupados`,
			accessToken: access_token,
			query: {
				start_date: start_date,
				end_date: end_date,
				sort: sort,
				frequency: frequency,
				filtro_tipo_movimiento: IFiltroTipoMovimiento.SALIDA,
				filtro_tipo_soporte: IFiltroTipoSoporte.PEDIDO
			},
			body
		});
	}

	static async getVentasAgrupadasLikeMetaValor({
		url,
		access_token,
		start_date,
		end_date,
		like_meta_valor,
		sort = SortDirection.DESC,
		frequency = IFrecuencia.DIARIO,
		groupBy = ['variante_id']
	}: {
		url: string;
		access_token: string;
		start_date: string;
		end_date: string;
		like_meta_valor: string;
		sort?: SortDirection;
		frequency?: IFrecuencia;
		groupBy?: Array<string>;
	}) {
		const request = new CSRequest(url);
		let body = {};
		if (groupBy.includes('meta_valor')) {
			body = {
				...body,
				group_by: groupBy
			};
		}
		return await request.post<Array<IVenta>>({
			primaryRoute: '/inventario',
			path: `/movimientos-agrupados`,
			accessToken: access_token,
			query: {
				start_date: start_date,
				end_date: end_date,
				sort: sort,
				like_meta_valor: like_meta_valor,
				frequency: frequency,
				filtro_tipo_movimiento: IFiltroTipoMovimiento.SALIDA,
				filtro_tipo_soporte: IFiltroTipoSoporte.PEDIDO
			},
			body
		});
	}

	static async getMetadatos({ url, access_token }: { url: string; access_token: string }) {
		const request = new CSRequest(url);
		return await request.get<Array<IMetadato>>({
			primaryRoute: '/inventario',
			path: '/metadatos-distinct',
			accessToken: access_token
		});
	}
}

export interface ISaldo {
	producto: string;
	sku: string;
	saldo: number;
}

export class Slado {
	async get_list({ url, access_token }: { url: string; access_token: string }) {
		const request = new CSRequest(url);
		return await request.get<Array<ISaldo>>({
			primaryRoute: '/inventario',
			path: `/saldos`,
			accessToken: access_token
		});
	}
}
