import { CSRequest, SortDirection } from '$lib';

interface IPedido {
	id?: string;
	fecha?: string;
	numero?: number;
	pago?: boolean;
	factura_numero?: number;
	contabilizado?: boolean;
	log?: string;
	q_intentos?: number;
}

export class Pedido {
    format(pedido: IPedido) {
        return {
            ...pedido,
            fecha: pedido.fecha ? new Date(pedido.fecha).toLocaleString('es-CO') : '',
            factura_numero: pedido.factura_numero ? pedido.factura_numero.toString() : '',
            log: pedido.log ? pedido.log : '-',
        }
    }

	async get_list(
		url: string,
		access_token: string,
		skip: number = 0,
		limit: number = 100,
		sort: SortDirection = SortDirection.DESC
	) {
		const request = new CSRequest(url);
		return await request.get<Array<IPedido>>(
			'/transacciones',
			`/pedidos`,
			access_token,
			undefined,
			{
				skip: skip.toString(),
				limit: limit.toString(),
				sort: sort
			}
		);
	}
}