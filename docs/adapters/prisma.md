---
id: prisma
title: Prisma Adapter
---

# Prisma

To use this Adapter, you need to install Prisma Client, Prisma CLI, and the separate `@next-auth/prisma-adapter` package:

:::warning
When using the **NextAuth v4 beta**, please make sure to use the `next` tagged version of your adapter. For more info on adapter changes, see [the migration docs](/getting-started/upgrade-v4#adapters)
:::

```bash npm2yarn
npm install next-auth@beta @prisma/client @next-auth/prisma-adapter@next
npm install prisma --save-dev
```

Configure your NextAuth.js to use the Prisma Adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

Schema for the Prisma Adapter (`@next-auth/prisma-adapter`)

## Setup

### Create the Prisma schema

You need to use at least Prisma 2.26.0. Create a schema file in `prisma/schema.prisma` similar to this one:

```json title="schema.prisma"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["referentialActions"] // You won't need this in Prisma 3.X or higher.
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?
  access_token       String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?
  session_state      String?
  oauth_token_secret String?
  oauth_token        String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Create the database schema with Prisma Migrate

```
npx prisma migrate dev
```

This will create an SQL migration file and execute it.

Note that you will need to specify your database connection string in the environment variable `DATABASE_URL`. You can do this by setting it in a `.env` file at the root of your project.

To learn more about [Prisma Migrate](https://www.prisma.io/migrate), check out the [Migrate docs](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Generate Client

Once you have saved your schema, use the Prisma CLI to generate the Prisma Client:

```
npx prisma generate
```

To configure you database to use the new schema (i.e. create tables and columns) use the `prisma migrate` command:

```
npx prisma migrate dev
```

## Naming Conventions

If mixed snake case and camel case column names is an issue for you and/or your underlying database system, we recommend using Prisma's `@Map()` feature to change the field names. This won't affect NextAuth, but will allow you to customize the column names to whichever naming convention you wish.

For example, moving to `snake_case` and plural table names.

```json title="schema.prisma"
model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String?
  access_token       String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?
  session_state      String?
  oauth_token_secret String?
  oauth_token        String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}
```
