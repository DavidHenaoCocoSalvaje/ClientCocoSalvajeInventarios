import { CSRequest, SortDirection } from '$lib';

export interface IMovimiento {
	tipo_movimiento_id: number;
	estado_variante_id: number;
	valor: number;
	soporte_id: string;
	fecha: string;
	tipo_soporte_id: number;
	variante_id: number;
	cantidad: number;
	bodega_id: number;
	nota: null;
	id: number;
}

export class MovimientosFormat {
	static movimientos(movimientos: Array<IMovimiento>) {
		return movimientos.map((movimiento: IMovimiento) => ({
			...movimiento,
			fecha: new Date(movimiento.fecha).toLocaleString('es-CO')
		}));
	}
}

export class Movimiento {
	async get_list(
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
