# Pull the base image
FROM node:14

# Set your working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all other source code to work directory
COPY . /usr/src/app

# TypeScript
# RUN npm run build

# Start
CMD [ "npm", "start" ]
