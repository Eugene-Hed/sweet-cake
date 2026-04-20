# =============================================================================
# Sweet-Cake API — Dockerfile multi-etapes
# =============================================================================

# --- Etape de base ---
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++

# --- Etape de developpement ---
FROM base AS development
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
CMD ["npm", "run", "dev"]

# --- Etape de construction ---
FROM base AS build
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build --workspace=apps/api

# --- Etape de production ---
FROM base AS production
ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
