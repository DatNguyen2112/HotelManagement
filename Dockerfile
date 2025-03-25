FROM node:14-alpine

WORKDIR /datnguyen/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build-src

EXPOSE 3306

CMD [ "npm", "run", "build" ]
