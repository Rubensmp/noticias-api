# Usando a imagem oficial do Node.js como base
FROM node:20.13.1

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiando o package.json e o package-lock.json
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante do código da aplicação
COPY . .

# Compilando o TypeScript para JavaScript
RUN npm run build

RUN npx prisma generate

# Expondo a porta que a aplicação usará
EXPOSE 3333

# Definindo o comando para rodar a aplicação
CMD ["node", "dist/server.mjs"]
