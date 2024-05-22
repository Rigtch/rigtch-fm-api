# FROM node:20-alpine as development
FROM imbios/bun-node:latest-20.12.2-debian as development

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

FROM imbios/bun-node:latest-20.12.2-debian as production

ARG NODE_ENV=production
ARG EnvironmentVariable
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./

RUN bun install --production --frozen-lockfile

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["bun", "run", "dist/src/main"]
