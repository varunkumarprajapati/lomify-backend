FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm i
COPY . .
EXPOSE 8000
CMD ["npm","run","dev"]

FROM base AS production
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 8000
CMD ["npm","start"]