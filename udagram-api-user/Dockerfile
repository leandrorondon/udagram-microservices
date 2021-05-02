## Build
FROM node:12-alpine as build
WORKDIR /app
COPY . .
# Needed by bcrypt
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm ci
RUN npm run build

## Run
FROM node:12-alpine
WORKDIR /app
COPY --from=build /app/www/ .
COPY package*.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm ci
EXPOSE 8080
CMD ["node", "server.js"]
