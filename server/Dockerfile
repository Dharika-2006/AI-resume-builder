FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy local code to the container image
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
