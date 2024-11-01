# Use the official Node.js image as base
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies including Prisma CLI
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# -----

# Use a lightweight Node.js image for production
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies, including Prisma client
RUN npm install --only=production

# Copy Prisma schema and generated client
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Copy built files and other application code from the builder stage
COPY --from=builder /app/.next ./.next

# Copy Prisma schema files to run migrations, if necessary
COPY prisma ./prisma

# Expose port 8844 to the outside world
EXPOSE 8844

# Run database migrations and start the app
CMD ["npm start"]
