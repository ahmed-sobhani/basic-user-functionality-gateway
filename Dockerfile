FROM node:14-alpine3.14 AS development

RUN apk update && \
    apk add --update openssl && \
    openssl genrsa -des3 -passout pass:adfdsfds -out server.pass.key 2048 && \
    openssl rsa -passin pass:adfdsfds -in server.pass.key -out server.key && \
    rm server.pass.key && \
    openssl req -new -key server.key -out server.csr \
        -subj "/C=UK/ST=Warwickshire/L=Leamington/O=Funtomim/OU=IT Department/CN=funtomim.com" && \
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

EXPOSE 80

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN npm install --global rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && \
    apk add --update openssl && \
    openssl genrsa -des3 -passout pass:adfdsfds -out server.pass.key 2048 && \
    openssl rsa -passin pass:adfdsfds -in server.pass.key -out server.key && \
    rm server.pass.key && \
    openssl req -new -key server.key -out server.csr \
        -subj "/C=UK/ST=Warwickshire/L=Leamington/O=Funtomim/OU=IT Department/CN=funtomim.com" && \
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

EXPOSE 80

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]