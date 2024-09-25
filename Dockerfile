FROM node:alpine AS base
WORKDIR /app
COPY package.json vite.config.ts tsconfig.json ./
COPY src ./src
RUN npm install && npm run build:local


FROM node:alpine AS prod
WORKDIR /app
RUN npm install --only-production --omit-dev
RUN apk add --no-cache sqlite
EXPOSE 8788
CMD ["npm", "run", "preview"]