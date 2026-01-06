#!/bin/bash
# Este script construye la imagen de Docker y guarda la salida en la carpeta docker

ENV_FILE=".env"

# Verificar que existe el archivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: No se encontró $ENV_FILE"
    exit 1
fi

pnpm --env-file=$ENV_FILE build

echo "🚀 Construyendo imagen:"
echo "📄 Usando archivo: $ENV_FILE"

# Verificar/crear carpeta build
if [ ! -d "build" ]; then
    mkdir -p "build"
fi

# Construir la imagen   
docker build -t "integraciones-client" .
# Limipiar imagenes
echo "🧹 Eliminando imágenes huérfanas..."
docker image prune -f

# Guardar la imagen en la carpeta build
echo "💾 Guardando imagen en build/"
docker save "integraciones-client" -o "build/integraciones-client.tar"

echo "✅ Imagen construida y guardada en build/integraciones-client.tar"