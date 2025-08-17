# Project Name

temtem technical test

## Project description

This project is a REST API for managing products. It includes features for user authentication (registration and login), product creation, retrieval, updating, and deletion, as well as attachment management. The API is built with NestJS and uses Swagger documentation endpoint protected by basic authentication.

## Tech stack

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Cloudinary](https://cloudinary.com/) for attachment storage
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/) for testing
- [Swagger](https://swagger.io/) for API documentation

## Setup (local & docker)

### Local

1.  Install dependencies:
    ```bash
    pnpm install
    ```
2.  Set up environment variables (see below).
3.  Run the application:
    ```bash
    pnpm run start:dev
    ```

### Docker

1.  Build the Docker image:
    ```bash
    docker build -t temtem-api .
    ```
2.  Run the Docker container:
    ```bash
    docker run -p 3000:3000 temtem-api
    ```

## Env variables (list)

Create a `.env` file in the root of the project and copy the content of the `.env.template` file and add your credentials, no need to deploy it localy, app is deployed at render platform and running on:

- app-url: https://temtem-technical-test.onrender.com/api/docs#/auth/Register_execute

## Seed accounts (owner email/password)

There are no seed accounts provided in the project. You can register a new user using the `/api/auth/register` endpoint:

- admin account: email: admin@temtem.com, password: password
- guest account: email: guest@temtem.com, password: password

## How to run tests

Run the following command to execute the tests (unit & e2e):

```bash
pnpm test:all
```

## API endpoints & Swagger docs

The API endpoints are documented using Swagger. You can access the Swagger UI at `http://localhost:3000/api/docs`.

The Swagger UI is protected by basic authentication. The default credentials are:

- **Username**: `admin`
- **Password**: `admin`

You can find the credentials in the `.env` file.

## What you would do next (future improvements)

- Implement a logging and monitoring solution.
- Add rate limiting to the API.
- Implement a more sophisticated error handling mechanism (Global catch).
- Implement a more robust authentication and authorization system (e.g., using JWT with refresh tokens).
- Add more features to the product management module (e.g., categories, reviews, etc.).
- Add more comprehensive testing, including integration tests.
- Implement an advanced CI/CD pipeline.
