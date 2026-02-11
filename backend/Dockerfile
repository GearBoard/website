# Base stage
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Builder stage (if you are using TypeScript or a build step)
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# RUN npm run build # Uncomment if you have a build script

# Runner stage
FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY . . 

# Generate Prisma Client again just in case (optional but safe)
RUN npx prisma generate

EXPOSE 3000

# Start command
CMD ["npm", "start"]
