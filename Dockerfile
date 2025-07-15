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
# Copiar el directorio de contenido para que las APIs puedan escribir
COPY --from=builder /app/src/content ./src/content

# Dar permisos de escritura al directorio de contenido
RUN chmod -R 755 ./src/content && chown -R node:node ./src/content

# Cambiar al usuario node para ejecutar la aplicación
USER node

EXPOSE 1030

ENV HOST="0.0.0.0"

# El comando para iniciar la aplicación en modo servidor
CMD ["node", "./dist/server/entry.mjs"] 