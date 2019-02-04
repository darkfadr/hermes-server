FROM node:10.15-alpine

ENV NODE_ENV production
ENV APP_NAME Hermes Server
ENV SMTP_PORT 25
ENV SMTP_HOST localhost

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app/

RUN npm install && \
  npm prune && \
  npm cache clean \
  rm -rf /tmp/*

ADD ./dist /usr/src/app/

EXPOSE 25

CMD ["node", "index.js"]
