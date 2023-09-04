# Use the official Node.js 14 image as the base image
FROM node:18

# Set the working directory
WORKDIR /workspace

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node packages
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli@13.2.5

# Expose ports for Angular development server
EXPOSE 4200 49153

# Start VS Code server (this will also start Angular development server)
CMD ["/bin/bash"]
