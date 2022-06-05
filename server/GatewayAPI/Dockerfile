FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js ./

RUN npm install --only=production

COPY ./src ./src

ENV PORT=3000
ENV ACCESS_TOKEN_SECRET=useraccesstokensecret

EXPOSE 3000

CMD ["npm", "start"]