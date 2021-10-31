FROM node:16.13.0

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 8080

ENV NODE_ENV=DEV

CMD npm run dev