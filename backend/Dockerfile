FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Compilar TypeScript a JavaScript antes de arrancar (dist/index.js)
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]