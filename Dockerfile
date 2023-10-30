FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json .
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
CMD [ "npm", "run", "dev" ]
EXPOSE 8080