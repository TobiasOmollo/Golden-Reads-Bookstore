FROM node:20-alpine AS builder

WORKDIR /app

# Copy package installation configurations
COPY package*.json ./
RUN npm ci

# Copy full application tree
COPY . .

# Build the production server and static pre-rendered routes
RUN npm run build

EXPOSE 8080

# Run Vite dev server, binding to all interfaces inside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

