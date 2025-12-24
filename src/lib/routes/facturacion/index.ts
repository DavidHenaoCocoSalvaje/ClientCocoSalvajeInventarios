import { CSRequest, formatDate, SortDirection } from '$lib';

interface IVenta {
	id: string;
	fecha: Date;
	numero: number;
	pago: boolean;
	factura_numero?: number;
	contabilizado: boolean;
	log?: string;
	q_intentos: number;
}

interface ICompra {
	id: string;
	fecha: Date;
	factura_id?: number;
	factura_numero?: number;
	contabilizado: boolean;
	q_intentos: number;
	numero_factura_proveedor?: string;
	log?: string;
}

interface IVentaFormat extends Omit<IVenta, 'fecha' | 'factura_numero'> {
	fecha: string;
	factura_numero: string;
}

interface ICompraFormat extends Omit<ICompra, 'fecha' | 'factura_numero'> {
	fecha: string;
	factura_numero: string;
}

export class FacturacionFormat {
	static ventas(ventas: Array<IVenta>): Array<IVentaFormat> {
		return ventas.map((venta: IVenta) => ({
			...venta,
			fecha: formatDate(venta.fecha, true),
			factura_numero: venta.factura_numero ? venta.factura_numero.toString() : '',
			log: venta.log ? venta.log : '-'
		}));
	}

	static compras(compras: Array<ICompra>): Array<ICompraFormat> {
		return compras.map((compra: ICompra) => ({
			...compra,
			fecha: formatDate(compra.fecha, true),
			factura_numero: compra.factura_numero ? compra.factura_numero.toString() : '',
			log: compra.log ? compra.log : '-'
		}));
	}
}

export class Venta {
	static async get_list({
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
		return await request.get<Array<IVenta>>({
			primaryRoute: '/facturacion',
			path: `/ventas`,
			accessToken: access_token,
			query: {
				skip: skip.toString(),
				limit: limit.toString(),
				sort: sort
			}
		});
	}
}

export class Compra {
	static async get_list({
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
		return await request.get<Array<ICompra>>({
			primaryRoute: '/facturacion',
			path: `/compras`,
			accessToken: access_token,
			query: {
				skip: skip.toString(),
				limit: limit.toString(),
				sort: sort
			}
		});
	}
}