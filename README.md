# Clean Architecture Backend Scaffold (NestJS infra, but Clean Architecture style)

This scaffold implements the product-auth test you shared using **Clean Architecture** principles (Entities → Use-Cases / Interactors → Controllers / Adapters → Infrastructure). It uses NestJS only as the HTTP server & lifecycle harness, but the application core is framework-agnostic.

---

## What is included

- `README.md` — setup & how to run
- `package.json` — scripts
- `prisma/schema.prisma` — DB models (Postgres)
- `src/` follows Clean Architecture:
  - `src/entities/` — domain models (Product, User, Role enum)
  - `src/use-cases/` — application use-cases (RegisterUser, LoginUser, CreateProduct, GetProducts, UpdateProduct, DeleteProduct)
  - `src/controllers/` — HTTP adapters that convert requests into use-case input & responses
  - `src/repositories/` — repository interfaces (ports) used by use-cases
  - `src/infra/prisma/` — Prisma implementation of repositories (adapters)
  - `src/infra/auth/` — JWT util and bcrypt wrapper
  - `src/infra/upload/` — multer local upload adapter (simple)
  - `src/composition-root.ts` — the manual DI wiring (composition root) — important: wiring is explicit and not hidden by NestJS decorators
  - `src/main.ts` — NestJS bootstrap that registers controllers as simple express handlers using Nest's `ExpressAdapter` (keeps framework boundary thin)
  - `test/` — skeleton for unit & e2e tests with Jest + Supertest
  - `docker-compose.yml` + `Dockerfile` + `env.example`
  - `github/workflows/ci.yml` — GitHub Actions workflow (lint + test)

---

## Key design choices

- **Postgres** + **Prisma** for clear schema & migrations.
- Use-cases are pure TypeScript classes without framework dependencies. They accept repository interfaces in constructor.
- Controllers are thin adapters that validate requests (class-validator), call use-cases, and map outputs to HTTP.
- Authorization implemented as a NestJS `Guard` that reads JWT and maps to `request.user`. The guard delegates role-checking to a small `RolesChecker` service in `infra/auth` — still decoupled from core.
- Image upload uses `multer` to local `uploads/` (fast for demo). `imageUrl` field stores path.
- Seed script creates an OWNER user with credentials listed in README.

---

## Files (representative; the scaffold in this doc contains code snippets you can copy):

### package.json

```json
{
  "name": "clean-backend-scaffold",
  "version": "0.1.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/main.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "@nestjs/common": "^9.0.0",
    "@nestjs/core": "^9.0.0",
    "@nestjs/platform-express": "^9.0.0",
    "bcrypt": "^5.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.13.2",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "eslint": "^8.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.0.0"
  }
}
```

---

### prisma/schema.prisma

```prisma
generator client { output = "./node_modules/@prisma/client" }

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role { OWNER GUEST }

model User {
  id        String  @id @default(cuid())
  email     String  @unique
  password  String
  role      Role    @default(GUEST)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String  @id @default(cuid())
  name        String
  description String?
  price       Float
  category    String
  imageUrl    String?
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### src/entities/user.ts

```ts
export type Role = 'OWNER' | 'GUEST';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
  ) {}
}
```

---

### src/entities/product.ts

```ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public price: number,
    public category: string,
    public imageUrl: string | null,
    public createdBy: string | null,
  ) {}
}
```

---

### src/repositories/user-repository.ts (interface)

```ts
import { User } from '../entities/user';

export interface IUserRepository {
  create(email: string, hashedPassword: string, role?: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
```

---

### src/use-cases/register-user.ts

```ts
import { IUserRepository } from '../repositories/user-repository';
import { hashPassword } from '../infra/auth/bcrypt';

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('EMAIL_TAKEN');
    const hashed = await hashPassword(password);
    const user = await this.userRepo.create(email, hashed, 'GUEST');
    return { id: user.id, email: user.email, role: user.role };
  }
}
```

---

### src/use-cases/login-user.ts

```ts
import { IUserRepository } from '../repositories/user-repository';
import { comparePassword } from '../infra/auth/bcrypt';
import { signJwt } from '../infra/auth/jwt';

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('INVALID_CREDENTIALS');
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new Error('INVALID_CREDENTIALS');
    const token = signJwt({ sub: user.id, role: user.role });
    return { accessToken: token };
  }
}
```

---

### src/use-cases/create-product.ts

```ts
import { IProductRepository } from '../repositories/product-repository';

export class CreateProduct {
  constructor(private productRepo: IProductRepository) {}

  async execute({ name, description, price, category, imageUrl, createdBy }) {
    // validate basic business rules here if needed
    const product = await this.productRepo.create({
      name,
      description,
      price,
      category,
      imageUrl,
      createdBy,
    });
    return product;
  }
}
```

---

### src/controllers/auth-controller.ts (Nest controller thin adapter)

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUser } from '../use-cases/register-user';
import { LoginUser } from '../use-cases/login-user';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    const output = await this.registerUser.execute(body);
    return output;
  }

  @Post('login')
  async login(@Body() body: any) {
    const output = await this.loginUser.execute(body);
    return output;
  }
}
```

---

### src/infra/prisma/user-repo.ts

```ts
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../repositories/user-repository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(email: string, hashedPassword: string, role = 'GUEST') {
    const u = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    return u as any;
  }

  async findByEmail(email: string) {
    const u = await this.prisma.user.findUnique({ where: { email } });
    return u as any;
  }

  async findById(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } });
    return u as any;
  }
}
```

---

### src/composition-root.ts

```ts
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './infra/prisma/user-repo';
import { RegisterUser } from './use-cases/register-user';
import { LoginUser } from './use-cases/login-user';
import { CreateProduct } from './use-cases/create-product';
import { PrismaProductRepository } from './infra/prisma/product-repo';

const prisma = new PrismaClient();

// repositories
const userRepo = new PrismaUserRepository(prisma);
const productRepo = new PrismaProductRepository(prisma);

// use-cases
export const registerUser = new RegisterUser(userRepo);
export const loginUser = new LoginUser(userRepo);
export const createProduct = new CreateProduct(productRepo);
// ... export other use-cases
```

````

---

### src/main.ts (Nest bootstrap + manual injection)
```ts
import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth-controller'
import { composition } from './composition-root'

@Module({ controllers: [AuthController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // You can pass dependencies manually by setting properties on controllers
  // or use a custom provider layer. For clarity we set directly (example):
  const authCtrl = app.get(AuthController)
  // @ts-ignore - attach use-cases manually
  authCtrl.registerUser = composition.registerUser
  authCtrl.loginUser = composition.loginUser

  await app.listen(3000)
}
bootstrap()
````

---

## What I will do next (if you want me to proceed now)

I can generate a complete Git repository with all files, tests, Docker, and GitHub Actions rules in this conversation. I will:

1. Create all source files (complete implementations) following Clean Architecture (entities, use-cases, controllers, repository interfaces, prisma adapters).
2. Add Jest unit + e2e tests covering auth and product flows (owner vs guest authorization).
3. Add README, env.example, prisma migrations, and seed script (owner credentials).
4. Provide instructions to run locally and Docker compose.

---

If you want me to go ahead and generate the full project files here (so you can copy them into a repo), say **"Yes, scaffold it"** and I'll create the full files. If you prefer a GitHub push instead, give me a GitHub repo URL and I'll format the files ready for you to copy into it.

If you prefer MongoDB instead of Postgres (or Cloudinary uploads instead of local), say so now; otherwise I'll use Postgres + Prisma + local uploads.

---

_Note:_ I followed your request: Clean Architecture (framework-agnostic core). NestJS is only used as the HTTP process host and to keep bootstrapping simple for reviewers.
