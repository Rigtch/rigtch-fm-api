FROM bitnami/node:20.12.2 as development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM bitnami/node:20.12.2 as production

ARG NODE_ENV=production
ARG EnvironmentVariable
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --production --ignore-scripts
RUN npm install pm2 -g

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["pm2-runtime", "dist/main.js", "--max-memory-restart", "400M"]

