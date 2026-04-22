# Dev Tools Portal

Dev Tools Portal is a NestJS + EJS application that serves:

- a public landing page with active links
- an admin login page
- a protected admin panel for creating, updating and deleting links

## Tech Stack

- NestJS 11
- MongoDB + Mongoose
- EJS templates + vanilla JavaScript
- JWT auth for admin API protection

## Features

- Public page at `/` that loads active tools from `/api/links`
- Admin login at `/admin`
- Admin panel at `/admin/panel`
- Protected admin endpoints at `/api/admin/links` guarded by JWT

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Recommended secure values:

- Use a long random `JWT_SECRET` (at least 32+ chars)
- Use a strong `ADMIN_PASSWORD`

Example JWT secret generation:

```bash
openssl rand -base64 48
```

## Installation

```bash
npm install
```

## Running The App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

## API Endpoints

### Auth

- `POST /api/auth/login`
  - body: `{ "email": string, "password": string }`
  - response: `{ accessToken, user }`

### Public links

- `GET /api/links`

### Admin links (Bearer token required)

- `GET /api/admin/links`
- `GET /api/admin/links/:id`
- `POST /api/admin/links`
- `PATCH /api/admin/links/:id`
- `DELETE /api/admin/links/:id`

Header format:

```http
Authorization: Bearer <accessToken>
```

## Admin Flow

1. Open `/admin`
2. Submit credentials to `/api/auth/login`
3. Access token is stored client-side
4. User is redirected to `/admin/panel`
5. Admin page sends bearer token to protected routes

## Admin Seeding

On app startup, a default admin user is seeded if one does not exist for `ADMIN_EMAIL`.

Current behavior uses fallback values when env vars are missing. For assignment and production readiness, configure all env vars explicitly in `.env`.

## Quality Commands

```bash
# lint
npm run lint

# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Notes For Reviewers

- Public and admin client scripts are separated in `public/js/`
- Admin APIs are JWT protected with `JwtAuthGuard`
- Login UI and Admin UI are rendered through EJS views
