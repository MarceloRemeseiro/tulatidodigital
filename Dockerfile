# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar las dependencias de producción desde la etapa de build
COPY --from=builder /app/node_modules ./node_modules
# Copiar la salida de la build desde la etapa de build
COPY --from=builder /app/dist ./dist
# Copiar archivos estáticos (incluyendo vídeos)
COPY --from=builder /app/public ./public
# Copiar archivos de configuración necesarios
COPY --from=builder /app/package*.json ./

# Asegurar que los subdirectorios necesarios existen
RUN mkdir -p ./public/assets

# Dar permisos de escritura al directorio público para videos
RUN chmod -R 755 ./public && chown -R node:node ./public

# Cambiar al usuario node para ejecutar la aplicación
USER node

EXPOSE 1030

ENV HOST="0.0.0.0"

# El comando para iniciar la aplicación en modo servidor
CMD ["node", "./dist/server/entry.mjs"] 