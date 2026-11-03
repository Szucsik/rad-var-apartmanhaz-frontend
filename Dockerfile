# Build the Angular app, then serve the static output with nginx.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/rad-var-apartmanhaz /usr/share/nginx/html

EXPOSE 80
