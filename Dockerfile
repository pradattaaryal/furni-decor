FROM node:22.11-alpine AS builder

# Create app directory
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.12.2 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22.11-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.12.2 && pnpm install --prod --frozen-lockfile

RUN mkdir -p images/users images/product_variants images/blogs

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD npx typeorm --dataSource=dist/database/data-source.js migration:run && CLI_PATH=./dist/cli.js npx nestjs-command trigger:init && CLI_PATH=./dist/cli.js npx nestjs-command seed:init && node dist/main.js