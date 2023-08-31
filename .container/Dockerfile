# Use the official Node.js image as the base image
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app's source code
COPY . . 

# Build the Angular app
RUN npm run build

# Use a lightweight nginx image for serving the app
FROM nginx:alpine

# Copy the built app from the previous stage into the nginx container
COPY --from=build /app/dist/rad-var-apartmanhaz /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
