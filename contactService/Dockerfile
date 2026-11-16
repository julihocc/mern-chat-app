#contactService/Dockerfile
FROM node:22-bookworm

# Create and Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Copy app to container
COPY . .

# Exports
EXPOSE 4000

# Run the "start" script in package.json
CMD ["npm", "start"]
