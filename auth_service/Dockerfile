FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./


FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/assets ./assets

CMD ["npm","start"]