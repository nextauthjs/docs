---
id: warnings
title: Warnings
---

This is a list of warning output from NextAuth.js.

All warnings indicate things which you should take a look at, but do not inhibit normal operation.

---

## Client

#### NEXTAUTH_URL

Environment variable `NEXTAUTH_URL` missing. Please set it in your `.env` file.

:::note
On [Vercel](https://vercel.com) deployments, we will read the `VERCEL_URL` environment variable, so you won't need to define `NEXTAUTH_URL`.
:::

---

## Server

These warnings are displayed on the terminal.

#### NO_SECRET

In development, we generate a `secret` based on your configuration for convenience. This is volatile and will throw an error in production. [Read more](https://next-auth.js.org/configuration/options#secret)

## Adapter

### ADAPTER_TYPEORM_UPDATING_ENTITIES

This warning occurs when typeorm finds that the provided entities differ from the database entities. By default while not in `production` the typeorm adapter will always synchronize changes made to the entities codefiles.

Disable this warning by setting `synchronize: false` in your typeorm config

Example:

```js title="/pages/api/auth/[...nextauth].js"
adapter: TypeORMLegacyAdapter({
  type: 'mysql',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DB,
  synchronize: false
}),
```
