/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseObject {
	#f?: any = {};

	protected set f(v) {
		this.#f = v;
	}
	protected get f(): any {
		return this.#f;
	}

	setters() {
		const prototipo = Object.getPrototypeOf(this);
		const descriptores = Object.getOwnPropertyDescriptors(prototipo);

		const setters = [];

		for (const nombrePropiedad in descriptores) {
			if (descriptores[nombrePropiedad].set) {
				setters.push(nombrePropiedad);
			}
		}

		return setters;
	}

	Val2Array(array: Array<any>, klass: typeof BaseObject) {
		for (let i = 0; i < array.length; i++) {
			const obj = new klass();
			array[i] = obj.fromObject(array[i]);
		}
		return array as unknown as Array<typeof klass>;
	}

	fromObject(obj: Record<string, any>) {
		const jsonKeys = Object.keys(obj);
		const setters = this.setters();
		for (const key of jsonKeys) {
			if (setters.includes(key)) {
				const value = obj[key];
				const typeValue = typeof value;
				if (['string', 'number', 'boolean'].includes(typeValue)) {
					(this as any)[key] = obj[key];
				} else if (value === null || typeof value === 'undefined') {
					continue;
				} else {
					(this as any)[key] = obj[key];
				}
			}
		}
	}

	toJson() {
		return JSON.stringify(this.f);
	}
}

export async function GetArray(
	backendUrl: string,
	primaryRoute: string,
	path: string,
	accessToken: string
) {
	const url = backendUrl + primaryRoute + path;
	const itemsReq = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	const items = await itemsReq.json();

	return items;
}
