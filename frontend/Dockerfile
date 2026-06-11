FROM node:20

WORKDIR /app

# 1. Copiar los packages desde la subcarpeta frontend
COPY frontend/package*.json ./

RUN npm install

# 2. Copiar todo el monorepositorio (así esbuild encuentra "../backend")
COPY . .

# 3. Movernos a la subcarpeta de trabajo para ejecutar los scripts
WORKDIR /app/frontend

RUN npm run build

# Exponer el puerto 3000 que definiste en tu server.ts
EXPOSE 3000

CMD ["npm", "start"]