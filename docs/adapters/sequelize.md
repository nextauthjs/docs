---
id: sequelize
title: Sequelize Adapter
---

# Sequelize

This is the Sequelize Adapter for [`next-auth`](https://next-auth.js.org).

:::warning
When using the **NextAuth v4 beta**, please make sure to use the `next` tagged version of your adapter. For more info on adapter changes, see [the migration docs](/getting-started/upgrade-v4#adapters)
:::

## Getting Started

1. Install the necessary packages, including a [database driver](https://sequelize.org/master/manual/getting-started.html) of choice.

```bash npm2yarn
npm install next-auth@beta @next-auth/sequelize-adapter sequelize sqlite3
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import SequelizeAdapter from "@next-auth/sequelize-adapter"
import Sequelize from 'sequelize'

const sequelize = new Sequelize('sqlite::memory:')

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  ...
  adapter: Sequelize(sequelize)
  ...
})
```

## Updating the database schema

By default, the sequelize adapter will not create tables in your database. In production, best practice is to create the [required tables](https://next-auth.js.org/adapters/models) in your database via [migrations](https://sequelize.org/master/manual/migrations.html). In development, you are able to call [`sequelize.sync()`](https://sequelize.org/master/manual/model-basics.html#model-synchronization) to have sequelize create the necessary tables, foreign keys and indexes:

```js
import NextAuth from "next-auth"
import SequelizeAdapter from "@next-auth/sequelize-adapter"
import Sequelize from 'sequelize'

const sequelize = new Sequelize("sqlite::memory:")
const adapter = SequelizeAdapter(sequelize)

// Calling sync() is not recommended in production
sequelize.sync()

export default NextAuth({
  ...
  adapter
  ...
})
```

## Using custom models

Sequelize models are option to customization like so:

```js
import NextAuth from "next-auth"
import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter"
import Sequelize, { DataTypes } from 'sequelize'

const sequelize = new Sequelize("sqlite::memory:")
const options = {
  models: {
    User: sequelize.define('user', { ...models.User, phoneNumber: DataTypes.STRING })
  }
}

export default NextAuth({
  ...
  adapter: SequelizeAdapter(sequelize, options)
  ...
})
```
