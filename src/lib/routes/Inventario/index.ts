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
	valor: number;
	sku: string;
	elemento_id: number;
	variante: string;
}
 
export interface IVentaFormat extends Omit<IVenta, 'valor' | 'fecha'> {
	valor: string;
    fecha: string;
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

export class Format {
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
			valor: formatCop(Number(venta.valor))
		}));
	}
}

export class Movimiento {
	static async get_list(
		url: string,
		access_token: string,
		skip: number = 0,
		limit: number = 100,
		sort: SortDirection = SortDirection.DESC
	) {
		const request = new CSRequest(url);
		return await request.get<Array<IMovimiento>>(
			'/inventario',
			`/movimientos`,
			access_token,
			undefined,
			{
				skip: skip.toString(),
				limit: limit.toString(),
				sort: sort
			}
		);
	}

	static async get_ventas(
		url: string,
		access_token: string,
		start_date: string,
		end_date: string,
		sort: SortDirection = SortDirection.DESC,
		frequency: IFrecuencia = IFrecuencia.DIARIO
	) {
		const request = new CSRequest(url);
		return await request.post<Array<IVenta>>(
			'/inventario',
			`/movimiento-reporte`,
			access_token,
			undefined,
			{
				start_date: start_date,
				end_date: end_date,
				sort: sort,
				frequency: frequency,
				filtro_tipo_movimiento: IFiltroTipoMovimiento.SALIDA
			},
			{
				group_by: ['variante_id']
			}
		);
	}
}

export interface ISaldo {
	producto: string;
	sku: string;
	saldo: number;
}

export class Slado {
	async get_list(url: string, access_token: string) {
		const request = new CSRequest(url);
		return await request.get<Array<ISaldo>>('/inventario', `/saldos`, access_token);
	}
}
