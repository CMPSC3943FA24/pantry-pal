# Use Node's official image as the base
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli @expo/ngrok@^4.1.0

# Copy package.json and package-lock.json first (for better caching)
COPY ./app/package*.json ./

# Install all dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY ./app ./

# Install Jest for testing
RUN npm install --save-dev jest

# Expose the Expo ports (19000 for development, 19001 for WebSocket)
EXPOSE 19000 19001 19002

# Just keep the container running without starting the server
CMD ["tail", "-f", "/dev/null"]