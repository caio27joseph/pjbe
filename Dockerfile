# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# This is separated to utilize the cache if there are no changes in these files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
# Make sure that the .dockerignore file excludes unnecessary files
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose port 3000 for the server
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
