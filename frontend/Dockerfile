# Use Node.js LTS (Long Term Support) Alpine for smaller size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install development dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose the development server port
EXPOSE 3000

# Copy the rest of the application
# (You can also mount this as a volume during development)
COPY . .

# Command to run the development server with hot-reloading
CMD ["npm", "run", "dev"]