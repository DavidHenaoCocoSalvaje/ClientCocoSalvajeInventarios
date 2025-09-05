# Dockerfile para cliente (frontend) de Coco Salvaje

# Prerrequisito: El proyecto debe ser compilado localmente antes de construir la imagen.
# Ejecute `pnpm build` en su máquina.

# Usa una imagen base oficial de node
FROM node:trixie-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instala pnpm
RUN npm i -g pnpm

# Copia los archivos de definición de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala solo las dependencias de producción
RUN pnpm install --prod

# Copia la aplicación ya construida y package.json
COPY --chown=node:node ./build ./build
COPY --chown=node:node ./package.json ./package.json

# Crea un usuario no-root para ejecutar la aplicación (buena práctica de seguridad)
RUN adduser --disabled-password --gecos '' coco && \
    chown -R coco:coco /app

# Cambia al usuario no-root
USER coco

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# El punto de entrada se define en la salida de svelte-kit build
CMD [ "node", "build/index.js" ]