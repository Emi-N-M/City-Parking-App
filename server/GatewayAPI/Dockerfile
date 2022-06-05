FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js ./

RUN npm install --only=production

COPY ./src ./src

ENV PORT=5001 
ENV MONGODB_URI=mongodb+srv://userAPI:userAPI@cluster0.zofw9.mongodb.net/City-Parking-App-DB?retryWrites=true&w=majority
ENV ACCESS_TOKEN_SECRET=useraccesstokensecret

EXPOSE 5001

CMD ["npm", "start"]