### STAGE 1: Build ###
FROM node:16-slim AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/emojivote /usr/share/nginx/html
