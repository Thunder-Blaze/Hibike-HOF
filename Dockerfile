# Use Node Alpine as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies first (for caching)
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Set environment variables (optional)
# ENV NODE_ENV=development

# Expose the desired port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
