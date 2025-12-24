#!/bin/bash
# Este script construye la imagen de Docker y guarda la salida en la carpeta docker

ENV_FILE=".env.production"

pnpm --env-file=$ENV_FILE build

echo "🚀 Construyendo imagen:"
echo "📄 Usando archivo: $ENV_FILE"

# Verificar que existe el archivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: No se encontró $ENV_FILE"
    exit 1
fi

# Verificar/crear carpeta docker
if [ ! -d "docker" ]; then
    mkdir -p "docker"
fi

# Construir la imagen   
docker build -t "integraciones-client" .
# Limipiar imagenes
echo "🧹 Eliminando imágenes huérfanas..."
docker image prune -f

# Guardar la imagen en la carpeta build
echo "💾 Guardando imagen en docker/"
docker save "integraciones-client" -o "docker/integraciones-client.tar"

echo "✅ Imagen construida y guardada en docker/integraciones-client.tar"