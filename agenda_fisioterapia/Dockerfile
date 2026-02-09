FROM node:20-alpine

WORKDIR /app

# Dependência necessária para Prisma
RUN apk add --no-cache openssl

# Copia package.json
COPY package*.json ./
RUN npm install

# Copia APENAS o Prisma (onde ele realmente está)
COPY src/prisma ./src/prisma

# Gera o Prisma Client no container (caminho correto)
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Copia o restante do projeto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]