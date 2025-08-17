# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN pnpm install --legacy-peer-deps

COPY . .
RUN pnpm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN pnpm install --only=production --legacy-peer-deps

CMD ["node", "dist/main.js"]
