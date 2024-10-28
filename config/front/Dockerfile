FROM node:21-alpine3.19

WORKDIR /app

COPY ./front/aviapavlik/yarn.lock ./front/aviapavlik/package.json ./

RUN yarn install

COPY ./front/aviapavlik/ .

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]
