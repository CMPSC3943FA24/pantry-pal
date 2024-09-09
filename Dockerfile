# Use Node's official image as the base
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package.json and package-lock.json first (for better caching)
COPY ./app/package*.json ./

# Install all dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY ./app .

# Install Jest for testing
RUN npm install --save-dev jest

# Expose the default Expo port
EXPOSE 19000

# Start the Expo app
CMD ["npm", "start"]
