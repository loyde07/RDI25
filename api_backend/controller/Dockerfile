FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .


CMD ["npm", "start"]
