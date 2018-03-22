FROM hivesolutions/ubuntu_dev:latest

LABEL version="1.0"
LABEL maintainer="Hive Solutions <development@hive.pt>"

EXPOSE 8080

ENV HOST 0.0.0.0
ENV PORT 8080
ENV NODE_ENV production

ADD app.js /app/
ADD package.json /app/
ADD webpack.config.js /app/
ADD static /app/static
ADD views /app/views

WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm install
RUN npm install --only=dev
RUN npm run build

CMD ["/usr/bin/node", "/app/app.js"]
