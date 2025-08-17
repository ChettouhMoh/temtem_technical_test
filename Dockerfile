# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy package files first to leverage Docker layer cache
    COPY package*.json pnpm-lock.yaml ./
    
    # Install dependencies
    RUN pnpm install --frozen-lockfile
    
    # Copy the rest of the source and build
    COPY . .
    RUN pnpm run build
    
    
    # ---------- Stage 2: Runtime ----------
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install pnpm in runtime image
    RUN npm install -g pnpm
    
    # Copy compiled code and minimal files needed at runtime
    COPY --from=builder /app/dist ./dist
    COPY package*.json pnpm-lock.yaml ./
    
    # Install only production dependencies
    RUN pnpm install --prod --frozen-lockfile
    
    EXPOSE 3000
    CMD ["pnpm", "run", "start:prod"]
    