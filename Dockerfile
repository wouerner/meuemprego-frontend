# syntax=docker/dockerfile:1

# =====================================================================
# Stage 1: Build
# =====================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código-fonte
COPY . .

# Build do SPA — VITE_API_URL é injetado em build-time via build-arg
ARG VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Type-check (vue-tsc) + vite build
RUN npm run build

# =====================================================================
# Stage 2: Serve estático com Nginx (SPA fallback)
# =====================================================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]