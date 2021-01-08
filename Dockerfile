FROM node:current-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

ENV PORT=8080
ARG NATSAPP=nats-example-cluster
ENV NATSAPPHOST=$NATSAPP

CMD [ "npm","start" ]