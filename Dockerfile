FROM node:22.2.0-slim

RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
RUN pnpm install:browsers

COPY build/ ./

EXPOSE 3000

CMD ["node", "index.js"]