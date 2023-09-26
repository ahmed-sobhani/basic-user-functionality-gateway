FROM node:14-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn add glob rimraf

RUN yarn install --pure-lockfile --only=development

COPY . .

RUN yarn build

FROM node:14-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]