---
id: dynamodb
title: DynamoDB
---

# DynamoDB

This is the AWS DynamoDB Adapter for next-auth. This package can only be used in conjunction with the primary next-auth package. It is not a standalone package.

You need a table with a partition key `pk` and a sort key `sk`. Your table also needs a global secondary index named `GSI1` with `GSI1PK` as partition key and `GSI1SK` as sorting key. You can set whatever you want as the table name and the billing method.

You can find the full schema in the table structure section below.

## Getting Started

:::warning
This adapter currently doesn't support the `next-auth` v4. If you want to help to migrate it, please open a PR/issue. Source code is here: https://github.com/nextauthjs/adapters/tree/main/packages/pouchdb For more info on adapter changes, see [the migration docs](/getting-started/upgrade-v4#adapters)
:::

1. Install `next-auth` and `@next-auth/dynamodb-adapter`

```bash npm2yarn
npm install next-auth @next-auth/dynamodb-adapter
```

2. Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object.

You need to pass `DocumentClient` instance from `aws-sdk` to the adapter.
The default table name is `next-auth`, but you can customise that by passing `{ tableName: 'your-table-name' }` as the second parameter in the adapter.

```javascript title="pages/api/auth/[...nextauth].js"
import AWS from "aws-sdk";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"

AWS.config.update({
  accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
  region: process.env.NEXT_AUTH_AWS_REGION,
});

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
  adapter: DynamoDBAdapter(
    new AWS.DynamoDB.DocumentClient()
  ),
  ...
});
```

(AWS secrets start with `NEXT_AUTH_` in order to not conflict with [Vercel's reserved environment variables](https://vercel.com/docs/environment-variables#reserved-environment-variables).)

## Schema

The table respects the single table design pattern. This has many advantages:

- Only one table to manage, monitor and provision.
- Querying relations is faster than with multi-table schemas (for eg. retrieving all sessions for a user).
- Only one table needs to be replicated, if you want to go multi-region.

Here is a schema of the table :

![DynamoDB Table](https://i.imgur.com/hGZtWDq.png)
