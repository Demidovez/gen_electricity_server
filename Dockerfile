FROM node:19.4-alpine

WORKDIR /usr/app

COPY package*.json ./

ENV TZ Europe/Minsk
RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]