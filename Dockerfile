# Use the official Node.js image as base
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Prisma globally
RUN npm install -g prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN prisma generate

# Build the Next.js app
RUN npm run build

# -----

# Use a lightweight Node.js image for production
FROM node:18-alpine

# Install OpenSSL to support Prisma on Alpine
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port 3000 to the outside world (assuming your app listens on port 3000)
EXPOSE 8844

# Start the Next.js app in production mode
CMD ["npm", "start"]
