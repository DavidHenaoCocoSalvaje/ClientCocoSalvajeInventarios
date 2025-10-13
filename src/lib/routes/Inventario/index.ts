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
    "cantidad_%": number;
	valor: number;
    "valor_%": number;
	sku: string;
	elemento_id: number;
	variante: string;
}
 
export interface IVentaFormat extends Omit<IVenta, 'valor' | 'fecha'> {
	valor: string;
    fecha: string;
}

export interface IMetadato {
    meta_atributo_id: number,
    meta_valor_id: number,
    meta_atributo: string,
    meta_valor: string
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
			valor: formatCop(Number(venta.valor)),
            "cantidad_%": `${venta['cantidad_%'].toFixed(3)}%`,
            "valor_%": `${venta['valor_%'].toFixed(3)}%`
		}));
	}
}

export class Movimiento {
	static async getList(
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

	static async getVentasAgrupadas(
		url: string,
		access_token: string,
		start_date: string,
		end_date: string,
		sort: SortDirection = SortDirection.DESC,
		frequency: IFrecuencia = IFrecuencia.DIARIO,
        groupBy: Array<string> = ['variante_id'],
        metaValorIds: Array<number> = []
	) {
		const request = new CSRequest(url);
        let body = {}
        if (groupBy.includes('meta_valor')) {
            body = {
                ...body,
                group_by: groupBy,
            }    
        }
        if (metaValorIds.length > 0) {
            body = {
                ...body,
                meta_valor_ids: metaValorIds,
            }
        }
		return await request.post<Array<IVenta>>(
			'/inventario',
			`/movimientos-agrupados`,
			access_token,
			undefined,
			{
				start_date: start_date,
				end_date: end_date,
				sort: sort,
				frequency: frequency,
				filtro_tipo_movimiento: IFiltroTipoMovimiento.SALIDA,
                filtro_tipo_soporte: IFiltroTipoSoporte.PEDIDO
			},
            body
		);
	}


    static async getVentasAgrupadasLikeMetaValor(
		url: string,
		access_token: string,
		start_date: string,
		end_date: string,
        like_meta_valor: string,
		sort: SortDirection = SortDirection.DESC,
		frequency: IFrecuencia = IFrecuencia.DIARIO,
        groupBy: Array<string> = ['variante_id'],
	) {
		const request = new CSRequest(url);
        let body = {}
        if (groupBy.includes('meta_valor')) {
            body = {
                ...body,
                group_by: groupBy,
            }    
        }
		return await request.post<Array<IVenta>>(
			'/inventario',
			`/movimientos-agrupados`,
			access_token,
			undefined,
			{
				start_date: start_date,
				end_date: end_date,
				sort: sort,
                like_meta_valor: like_meta_valor,
				frequency: frequency,
				filtro_tipo_movimiento: IFiltroTipoMovimiento.SALIDA,
                filtro_tipo_soporte: IFiltroTipoSoporte.PEDIDO
			},
            body
		);
	}


    static async getMetadatos(
        url: string,
        access_token: string,
    ) {
        const request = new CSRequest(url);
        return await request.get<Array<IMetadato>>(
            '/inventario',
            '/metadatos-distinct',
            access_token,
        )
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