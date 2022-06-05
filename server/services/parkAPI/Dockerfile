FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js ./

RUN npm install --only=production

COPY ./src ./src

ENV PORT=5002 
ENV MONGODB_URI=mongodb://0.0.0.0:27017/city-parking-app
ENV ACCESS_TOKEN_SECRET=parkaccesstokensecret

EXPOSE 5002

CMD ["npm", "start"]