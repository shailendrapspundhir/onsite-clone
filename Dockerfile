
# Use a small Node.js base image
FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    bash \
    postgresql-client \
    redis-server \
    procps \
    && rm -rf /var/lib/apt/lists/*



# Install pnpm (standalone, recommended for Docker)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set up working directory
WORKDIR /app

# Copy project files
COPY . .

# Install project dependencies
ENV CI=true

RUN pnpm install
RUN pnpm -w run build

# Postgres
EXPOSE 5432
# Redis
EXPOSE 6379


# Auth service
EXPOSE 3001
# User management service
EXPOSE 3002
# Job service
EXPOSE 3003
# Admin dashboard
EXPOSE 3004
# Worker app
EXPOSE 3005
# Employer app
EXPOSE 3006

# Start all services (example, adjust as needed)
CMD [ "cd app && pnpm prod" ]
