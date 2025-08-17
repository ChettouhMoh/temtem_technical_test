# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Only package files first to leverage Docker layer cache
    COPY package*.json ./
    RUN npm ci --legacy-peer-deps
    
    # Copy the rest of the source and build
    COPY . .
    RUN npm run build
    
    
    # ---------- Stage 2: Runtime ----------
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Copy compiled code and minimal files needed at runtime
    COPY --from=builder /app/dist ./dist
    COPY package*.json ./
    
    # Install only production deps
    RUN npm ci --only=production --legacy-peer-deps
    
    EXPOSE 3000
    CMD ["npm", "run", "start:prod"]
    