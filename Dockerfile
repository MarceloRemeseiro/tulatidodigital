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

EXPOSE 1030

ENV HOST="0.0.0.0"

# El comando para iniciar la aplicación en modo servidor
CMD ["node", "./dist/server/entry.mjs"] 