# DevHire -- Fullstack Job Board Platform

A production-ready job board application where employers can post positions and
candidates can search, filter, and apply. Built as a portfolio project
demonstrating fullstack TypeScript development with modern tooling.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, TypeScript, Vite        |
| Styling    | Tailwind CSS                      |
| Backend    | Node.js, Express, TypeScript      |
| Database   | PostgreSQL 16                     |
| ORM        | Prisma                            |
| Auth       | JWT (jsonwebtoken + bcrypt)       |
| Validation | Zod                               |
| Infra      | Docker Compose (database)         |

## Architecture

```
devhire/
|
|-- server/                   Express API
|   |-- src/
|   |   |-- index.ts          Entry point
|   |   |-- routes/           Route definitions
|   |   |-- controllers/      Request handlers
|   |   |-- middleware/        Auth guard, validation
|   |   |-- lib/              Prisma client singleton
|   |   +-- types/            Shared TypeScript types
|   +-- prisma/
|       +-- schema.prisma     Database schema
|
|-- client/                   React SPA
|   |-- src/
|   |   |-- main.tsx          Entry point
|   |   |-- App.tsx           Router setup
|   |   |-- api/              Axios client
|   |   |-- hooks/            Custom React hooks
|   |   |-- pages/            Route-level components
|   |   |-- components/       Reusable UI components
|   |   |-- context/          Auth context provider
|   |   +-- types/            Shared TypeScript types
|   +-- index.html
|
|-- docker-compose.yml        PostgreSQL container
+-- .env.example              Environment variable template
```

### Data Model

```
User  --(1:N)--  Job  --(1:N)--  Application  --(N:1)--  User
 |                                     |
 | role: EMPLOYER | CANDIDATE          | status: PENDING | REVIEWED
 |                                     |         ACCEPTED | REJECTED
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- npm

### 1. Clone and configure

```bash
git clone https://github.com/rodhfr/devhire.git
cd devhire
cp .env.example .env
```

### 2. Start the database

```bash
docker-compose up -d
```

### 3. Set up the server

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The API will be available at `http://localhost:3001`.

### 4. Set up the client

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Documentation

All endpoints are prefixed with `/api`.

### Authentication

| Method | Path                | Body                                             | Auth | Description        |
|--------|---------------------|--------------------------------------------------|------|--------------------|
| POST   | /api/auth/register  | name, email, password, role (EMPLOYER/CANDIDATE) | No   | Create account     |
| POST   | /api/auth/login     | email, password                                  | No   | Get JWT token      |

### Jobs

| Method | Path                        | Query Params                                      | Auth     | Description                    |
|--------|-----------------------------|---------------------------------------------------|----------|--------------------------------|
| GET    | /api/jobs                   | search, location, type, minSalary, maxSalary, page, limit | No       | List jobs (paginated)          |
| GET    | /api/jobs/:id               | --                                                | No       | Job details                    |
| POST   | /api/jobs                   | title, company, location, type, salaryMin, salaryMax, description, requirements | Employer | Create job                     |
| PUT    | /api/jobs/:id               | (same as POST)                                    | Employer | Update own job                 |
| DELETE | /api/jobs/:id               | --                                                | Employer | Delete own job                 |
| GET    | /api/jobs/:id/applications  | --                                                | Employer | Applications for own job       |

### Applications

| Method | Path                           | Body         | Auth      | Description                |
|--------|--------------------------------|--------------|-----------|----------------------------|
| POST   | /api/jobs/:id/apply            | coverLetter  | Candidate | Apply to job               |
| GET    | /api/applications/me           | --           | Candidate | My applications            |
| PATCH  | /api/applications/:id/status   | status       | Employer  | Update application status  |

### Response Format

All responses follow this structure:

```json
{
  "data": { ... },
  "message": "Success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

Error responses:

```json
{
  "error": "Description of what went wrong"
}
```

## Environment Variables

| Variable       | Description              | Default                                                        |
|----------------|--------------------------|----------------------------------------------------------------|
| DATABASE_URL   | PostgreSQL connection    | postgresql://devhire:devhire@localhost:5432/devhire?schema=public |
| JWT_SECRET     | Secret for signing JWTs  | (required)                                                     |
| PORT           | Server port              | 3001                                                           |
| VITE_API_URL   | API base URL for client  | http://localhost:3001/api                                      |
## Attribution

This project was initially based on the open-source DevHire project by rodhfr, licensed under the MIT License.

The original codebase has been modified and extended with additional functionality, including AI-powered candidate-job matching, skill-gap analysis, candidate recommendations, CI/CD workflows, and AWS deployment.
## License

MIT
