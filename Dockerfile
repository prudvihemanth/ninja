FROM node:latest
WORKDIR  /usr/src/app
COPY package*.json ./
COPY docs ./docs
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]