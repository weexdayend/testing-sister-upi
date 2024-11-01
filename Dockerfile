# Use the official Node.js image as the base for the builder stage
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma/ 

# Install dependencies, including development dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# -----

# Use a lightweight Node.js image for production
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files and Prisma Client from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules/.prisma ./.prisma
COPY --from=builder /app/prisma ./prisma

# Expose port 8844 to the outside world
EXPOSE 8844

# Start the Next.js app in production mode
CMD ["npm", "start"]
