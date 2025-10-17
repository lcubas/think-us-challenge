# Think Us Challenge API - Backend

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Security Measures](#security-measures)
- [Architecture Decisions](#architecture-decisions)
- [Verification Checklist](#verification-checklist)

## Features

✅ **Authentication & Authorization**
- User registration and login with JWT tokens
- Role-based access control (Employee, Admin)
- Access token + Refresh token pattern
- Secure password hashing with bcrypt
- Token validation middleware

✅ **Security**
- SQL Injection prevention via Sequelize ORM
- XSS protection through input sanitization
- Rate limiting on authentication endpoints
- CORS with configurable origin
- Helmet for HTTP headers security
- Environment variable validation
- Password strength requirements

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcryptjs, helmet, express-rate-limit, cors
- **Testing**: Jest
- **Documentation**: Swagger 2.0
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 12+ (local or via Docker)
- Docker & Docker Compose (optional, for containerized deployment)

## Installation

### Local Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd hr-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure `.env`** (see Configuration section)

5. **Initialize database**
```bash
npm run migrate:up
npm run migrate:down
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hr_db
DB_USER=hr_user
DB_PASSWORD=secure_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3001

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Running the Application

### Development

Local
```bash
npm run dev
```

Docker
```bash
docker-compose up -d
```

Running migrations
```bash
docker compose exec api npm run migrate
```

- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/health

## API Documentation

### Swagger/OpenAPI

Full interactive API documentation available at:
```
http://localhost:3000/api/docs
```

## Testing

### Run Tests

```bash
# Run all tests
npm run test

# Coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: `/tests/unit/` - Service and utility function tests
