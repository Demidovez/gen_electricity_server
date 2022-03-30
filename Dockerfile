FROM node:16-alpine
EXPOSE 5107
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "start" ]