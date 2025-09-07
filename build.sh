#!/bin/bash

# Salir inmediatamente si un comando falla
set -e

# 1. Construir la aplicación SvelteKit
echo "Construyendo la aplicación con pnpm..."
pnpm build

# 2. Construir la imagen de Docker
echo "Construyendo la imagen de Docker..."
docker build . -t client-cocosalvaje

echo "Proceso completado."
echo "Imagen creada: client-cocosalvaje:latest"
