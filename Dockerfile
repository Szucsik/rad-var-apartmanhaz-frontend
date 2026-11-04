# Build the Angular app with server-side rendering, then serve it with Node.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# The server bundle also contains Express and compression; only the build output is needed at runtime.
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=build /app/dist/rad-var-apartmanhaz ./dist/rad-var-apartmanhaz

USER node
EXPOSE 4000

CMD ["node", "dist/rad-var-apartmanhaz/server/server.mjs"]
