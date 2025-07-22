// src/lib/stores/userStore.ts
import { writable } from 'svelte/store';

// Define el tipo de usuario para el store, usando la misma interfaz de App.Locals.user
type UserStoreType = App.Locals['user'];

// Crea un store writable para el usuario
// Inicialmente es null (no logeado)
export const userStore = writable<UserStoreType>(null);

// Puedes añadir funciones auxiliares si lo necesitas
export const setUser = (user: UserStoreType) => {
	userStore.set(user);
};

export const clearUser = () => {
	userStore.set(null);
};
