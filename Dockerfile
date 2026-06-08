FROM node:20-alpine AS builder

WORKDIR /app

# Copy package installation configurations
COPY package*.json ./
RUN npm ci

# Copy full application tree
COPY . .

# Build the production server and static pre-rendered routes
RUN npm run build

EXPOSE 3000

# TanStack Start runs on port 3000 by default in production mode
CMD ["npm", "run", "start"]
