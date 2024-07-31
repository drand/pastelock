FROM node:19
WORKDIR /app
COPY . /app
RUN rm -rf node_modules package-lock.json
RUN npm install
CMD npm run start:dev
