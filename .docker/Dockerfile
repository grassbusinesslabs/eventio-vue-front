# build stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY .docker/default.conf /etc/nginx/conf.d/
EXPOSE 8080
