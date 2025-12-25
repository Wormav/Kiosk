FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine

# Install postgresql-client for pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package.json and production dependencies
COPY ./package.json package-lock.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# Copy the application build
COPY --from=build-env /app/build ./build

# Copy Prisma files needed for migrations and seeds
COPY ./prisma ./prisma
COPY ./prisma.config.ts ./
COPY ./questions.csv ./

# Install dependencies needed for seeds (tsx, prisma, csv-parse)
RUN npm install prisma tsx csv-parse

# Generate the Prisma client
RUN npx prisma generate

# Copy and configure the entrypoint
COPY ./docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
