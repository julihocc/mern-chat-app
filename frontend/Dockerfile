#frontend/Dockerfile
FROM node:18-alpine

# Create and Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app to container
COPY . .

EXPOSE 3000

# Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
