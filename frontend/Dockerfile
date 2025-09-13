#frontend/Dockerfile
FROM node:16.20.1

# Create and Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Copy app to container
COPY . .

EXPOSE 3000

# Run the "start" script in package.json
CMD ["npm", "start"]
