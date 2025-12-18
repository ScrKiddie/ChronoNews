FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./

CMD ["node", "server.js"]