FROM node:16-alpine
RUN apk update && apk upgrade

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .

COPY docker/entrypoint.sh /
ENTRYPOINT ["sh", "/entrypoint.sh"]