# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY . .

# Build your Angular application
RUN npm run build:ssr

# Create a production-ready image with a smaller base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular application from the previous build stage
COPY --from=build /app/dist /app/dist

# Expose the port your SSR application is running on (e.g., 4000)
EXPOSE 4000

# Start your SSR application
CMD ["node", "dist/rad-var-apartmanhaz/server/main.js"]