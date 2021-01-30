FROM node:14 AS build

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json .
COPY tsconfig.json .
COPY . ./
RUN npm install
RUN npm run build

FROM node:14-alpine
COPY --from=build /home/app/package.json .
COPY --from=build /home/app/dist ./dist
RUN npm install --production

EXPOSE 7080

CMD ["npm", "run", "start"]