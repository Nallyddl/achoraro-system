# 1. Etapa de Construcción (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar paquetes del backend y del frontend si es un monorepo
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copiar todo el código de las carpetas
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Construir el frontend (Vite) para que genere el "dist"
RUN cd frontend && npm run build

# Mover los archivos estáticos compilados al backend para que los sirva Express
RUN cp -r frontend/dist backend/dist

# 2. Etapa de Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm prune --production

# Copiar lo compilado desde el builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/server.ts ./server.ts
# Nota: Si usas ts-node o compilas server.ts a JS, asegúrate de copiar el archivo ejecutable final.

EXPOSE 3000
CMD ["node", "server.js"]