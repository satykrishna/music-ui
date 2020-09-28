# * pull node image as frontend base and set up npm/angular-cli
FROM node:10.16-alpine AS validusBuildApp

# install angular-cli as node user
RUN chown -R node:node /usr/local/lib/node_modules \
  && chown -R node:node /usr/local/bin

USER node
RUN npm install -g @angular/cli@9.1.3

# set npm as default package manager for root
USER root


# * set up directories and configuration for frontend webapp
WORKDIR /usr/src/app/validusBuildApp
COPY . .
RUN npm install
RUN ng build --prod --outputPath=built-angular
RUN ls -al

# -----------------

FROM node:10.16-alpine

RUN mkdir -p /app

RUN npm install -g @angular/cli@9.1.3
RUN ng config -g cli.packageManager npm
RUN npm install -g live-server


WORKDIR /validus-music-ui

COPY --from=validusBuildApp ./usr/src/app/validusBuildApp/built-angular .

RUN ls -al


ENV NODE_ENV=production

EXPOSE 8080

CMD ["live-server", "--port=8080", "--host=0.0.0.0", "--no-browser", "--entry-file=index.html"]
