FROM node:18.19.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --force

COPY . ./app

CMD ["npm", "start"]