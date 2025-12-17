import { CSRequest, formatDate, SortDirection } from '$lib';

interface IPedido {
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

interface IPedidoFormat extends Omit<IPedido, 'fecha' | 'factura_numero'> {
	fecha: string;
	factura_numero: string;
}

interface ICompraFormat extends Omit<ICompra, 'fecha' | 'factura_numero'> {
	fecha: string;
	factura_numero: string;
}

export class TransaccionesFormat {
	static pedidos(pedidos: Array<IPedido>): Array<IPedidoFormat> {
		return pedidos.map((pedido: IPedido) => ({
			...pedido,
			fecha: formatDate(pedido.fecha, true),
			factura_numero: pedido.factura_numero ? pedido.factura_numero.toString() : '',
			log: pedido.log ? pedido.log : '-'
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

export class Pedido {
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
		return await request.get<Array<IPedido>>({
			primaryRoute: '/transacciones',
			path: `/pedidos`,
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
			primaryRoute: '/transacciones',
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