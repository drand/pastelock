FROM node:19
WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./src /app/src
COPY tsconfig.json /app
RUN npm install 
CMD npm start
