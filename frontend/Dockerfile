#frontend/Dockerfile
FROM node:22-alpine

# Create and Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app to container
COPY . .

EXPOSE 3000

# Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
