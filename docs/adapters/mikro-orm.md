---
id: mikro-orm
title: MikroORM
---

# MikroORM

To use this Adapter, you need to install Mikro ORM, the driver that suits your database, and the separate `@next-auth/mikro-orm-adapter` package:

:::warning
Please make sure to use the `next` tagged version of mikro-orm. Refer [here](https://github.com/jonahallibone/mikro-orm-nextjs) for a setup example with NextJS.
:::

:::warning
Please make sure to use the `next` tagged version of the adapter.
:::

```bash npm2yarn
npm install next-auth@beta @next-auth/mikro-orm-adapter@next @mikro-orm/core@next @mikro-orm/[YOUR DRIVER]@next
```

Configure NextAuth.js to use the MikroORM Adapter:

```typescript title="pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MikroOrmAdapter } from "@next-auth/mikro-orm-adapter"

const prisma = new PrismaClient()

export default NextAuth({
  adapter: MikroOrmAdapter({
    // MikroORM options object. Ref: https://mikro-orm.io/docs/next/configuration#driver
    dbName: "./db.sqlite",
    type: "sqlite",
    // you can add e
    entities: [],
    debug: process.env.DEBUG === "true" || process.env.DEBUG?.includes("db"),
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

## Setup

### Passing custom entities

The MikroORM adapter ships with its own set of entities. If you'd like to override them, you can optionally pass them to the adapter.

```typescript title="pages/api/auth/[...nextauth].ts"
import config from "config/mikro-orm.ts"
import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { defaultEntities } from "@next-auth/mikro-orm-adapter"

const { Account, Session } = defaultEntities

@Entity()
export class User implements defaultEntities.User {
  @PrimaryKey()
  id: string = randomUUID()

  @Property({ nullable: true })
  name?: string

  @Property({ nullable: true })
  @Unique()
  email?: string

  @Property({ type: "Date", nullable: true })
  emailVerified: Date | null = null

  @Property({ nullable: true })
  image?: string

  @OneToMany({
    entity: () => Session,
    mappedBy: (session) => session.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  sessions = new Collection<Session>(this)

  @OneToMany({
    entity: () => Account,
    mappedBy: (account) => account.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  accounts = new Collection<Account>(this)

  @Enum({ hidden: true })
  role = "ADMIN"
}

export default NextAuth({
  adapter: MikroOrmAdapter(config, { entities: { User } })
})
```

### Including the default entities in your MikroORM config

You may want to include the defaultEntities in your MikroORM configuration to include them in Migrations etc.

To achieve that include them in your "entities" array:

```typescript title="config/mikro-orm.ts"
import { Options } from "@mikro-orm/core";
import { defaultEntities } from "@next-auth/mikro-orm-adapter"

const config: Options = {
  dbName: "./db.sqlite",
  type: "sqlite",
  entities: [VeryImportantEntity, Object.values(defaultEntities)],
  debug: process.env.NODE_ENV === "development",
};

export default config;
```
