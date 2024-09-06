# Use Debian-based image instead of Alpine
FROM node:20 AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json  pnpm-lock.yaml* ./

# Install dependencies based on the preferred package manager
RUN corepack enable pnpm && pnpm install;

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .



# Generate Prisma client
RUN npx prisma generate

# Build the Nuxt.js application
RUN npm run build

# 3. Production image, install production dependencies
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nuxtjs

# Copy only the necessary files and directories
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules/ ./node_modules



# Copy Prisma schema and other necessary files
COPY prisma ./prisma

USER nuxtjs

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
