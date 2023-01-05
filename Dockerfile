FROM node:16-alpine
EXPOSE 5011
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
ENV TZ Europe/Minsk
COPY . .
ENTRYPOINT [ "npm", "start" ]