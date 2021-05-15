## Build
FROM node:12-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install -g ionic
RUN npm ci
COPY ./ /app/
RUN ionic build --prod

## Run 
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/www/ /usr/share/nginx/html/
