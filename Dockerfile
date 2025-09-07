# Dockerfile para cliente (frontend) de Coco Salvaje
# PRERREQUISITO: La aplicación debe ser construida localmente (ej. con `pnpm build`) 
# antes de construir esta imagen.

FROM node:trixie-slim
WORKDIR /app

# Instala pnpm usando el script oficial
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - 
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Copia los archivos de dependencias e instala solo las de producción
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install --prod

# Copia la aplicación que fue compilada localmente en el directorio ./build
COPY build/ ./

# Crea el usuario 'coco' y le transfiere la propiedad de la aplicación
RUN adduser --disabled-password --gecos '' coco && \
    chown -R coco:coco /app

# Cambia al usuario 'coco' para la ejecución
USER coco

# Expone el puerto y define el comando de inicio
EXPOSE 3000
CMD [ "node", "index.js" ]