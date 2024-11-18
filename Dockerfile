FROM node:20-alpine

RUN apk add --no-cache git
WORKDIR /app
COPY package.json yarn.lock* ./
# パッケージを公開する場合は、Github経由でなくもよいので修正
RUN yarn add github:cog1t0/chappa_install
RUN yarn install
COPY . .
RUN chmod +x /app/node_modules/chappa-install/cli.js
RUN npm link
