---
id: dgraph
title: Dgraph
---

# Dgraph

This is the Dgraph Adapter for [`next-auth`](https://next-auth.js.org).

:::warning
When using the **NextAuth v4 beta**, please make sure to use the `next` tagged version of your adapter. For more info on adapter changes, see [the migration docs](/getting-started/upgrade-v4#adapters)
:::

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth@beta @next-auth/dgraph-adapter@next
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { DgraphAdapter, DgraphClient } from "@next-auth/dgraph-adapter"

const dgraph = new DgraphClient({
  endpoint: process.env.DGRAPH_GRAPHQL_ENDPOINT,
  apiKey: process.env.DGRAPH_GRAPHQL_KEY,
  // you can omit the following properties if you are running an unsecure schema
  adminSecret: process.env.DGRAPH_ADMIN_SECRET,
  authHeader: process.env.AUTH_HEADER, // "<YOUR AUTH HEADER>",
  jwtSecret: process.env.SECRET
});

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: DgraphAdapter(dgraph)
})
```

## Quick start with the unsecure schema

The quickest way to use Dgraph is by applying the unsecure schema to your [local](https://dgraph.io/docs/graphql/admin/#modifying-a-schema) Dgraph instance or if using Dgraph [cloud](https://dgraph.io/docs/cloud/cloud-quick-start/#the-schema) you can paste the schema in the codebox to update. If using Dgraph cloud, you will need to create an api client key and grab your endpoint to initialize your `DgraphClient`.

:::warning
This approach is not secure or for production use, and does not require `adminSecret`, `authHeader` and `jwtSecret`.
:::

#### Unsecure schema
```graphql
type Account {
  id: ID
  type: String
  provider: String @search(by: [hash])
  providerAccountId: String @search(by: [hash])
  refreshToken: String
  expires_at: DateTime
  accessToken: String
  token_type: String
  refresh_token: String
  access_token: String
  scope: String
  id_token: String
  session_state: String
  oauth_token_secret: String
  oauth_token: String
  createdAt: DateTime
  updatedAt: DateTime
  user: User @hasInverse(field: "accounts")
}
type Session {
  id: ID
  expires: DateTime
  sessionToken: String @search(by: [hash])
  createdAt: DateTime
  updatedAt: DateTime
  user: User @hasInverse(field: "sessions")
}
type User {
  id: ID
  name: String
  email: String @search(by: [hash])
  emailVerified: DateTime
  image: String
  createdAt: DateTime
  updatedAt: DateTime
  accounts: [Account] @hasInverse(field: "user")
  sessions: [Session] @hasInverse(field: "user")
}

type VerificationRequest {
  id: ID
  identifier: String @search(by: [hash])
  token: String @search(by: [hash])
  expires: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Securing your database

For production deployments you will want to restrict the access to the types used
by next-auth. The main form of access control used in Dgraph is via `@auth` directive alongide types in the schema.

#### Secure schema
```graphql
type Account
  @auth(
    delete: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    add: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    query: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    update: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
  ) {
  id: ID
  type: String
  provider: String @search(by: [hash])
  providerAccountId: String @search(by: [hash])
  refreshToken: String
  expires_at: DateTime
  accessToken: String
  token_type: String
  refresh_token: String
  access_token: String
  scope: String
  id_token: String
  session_state: String
  oauth_token_secret: String
  oauth_token: String
  createdAt: DateTime
  updatedAt: DateTime
  user: User @hasInverse(field: "accounts")
}
type Session
  @auth(
    delete: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    add: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    query: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    update: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
  ) {
  id: ID
  expires: DateTime
  sessionToken: String @search(by: [hash])
  createdAt: DateTime
  updatedAt: DateTime
  user: User @hasInverse(field: "sessions")
}
type User
  @auth(
    query: {
      or: [
        {
          rule: """
          query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
          """
        }
        { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
      ]
    }
    delete: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    add: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    update: {
      or: [
        {
          rule: """
          query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
          """
        }
        { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
      ]
    }
  ) {
  id: ID
  name: String
  email: String @search(by: [hash])
  emailVerified: DateTime
  image: String
  createdAt: DateTime
  updatedAt: DateTime
  accounts: [Account] @hasInverse(field: "user")
  sessions: [Session] @hasInverse(field: "user")
}

type VerificationRequest
  @auth(
    delete: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    add: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    query: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
    update: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
  ) {
  id: ID
  identifier: String @search(by: [hash])
  token: String @search(by: [hash])
  expires: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}

# Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"YOUR CUSTOM NAMESPACE HERE","Algo":"HS256"}
```

#### Dgraph.Authorization

In order to secure your graphql backend is to define the `Dgraph.Authorization` object at the
bottom of your schema and provide `adminSecret`, `authHeader` and `jwtSecret` values to the DgraphClient.

```js
# Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"YOUR CUSTOM NAMESPACE HERE","Algo":"HS256"}
```

#### VerificationKey and jwtSecret

This is the key used to sign the JWT. Ex. `process.env.SECRET` or `process.env.APP_SECRET`.

#### Header and authHeader

The `Header` tells Dgraph where to lookup a JWT within the headers of the incoming requests made to the dgraph server.
You have to configure it at the bottom of your schema file. This header is the same as the `authHeader` property you
provide when you instantiate the `DgraphClient`.

#### The adminSecret

The admin secret enables an overriding rule that bypasses the JWT DgraphClient sends with each request. This allows
secure interactions to be made with the auth types required by next-auth. You have to specify it for each auth rule of
each type defined in your secure schema.

```js
type VerificationRequest
  @auth(
    delete: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" },
    add: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" },
    query: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" },
    update: { rule: "{$adminSecret: { eq: \"<YOUR ADMIN SECRET HERE>\" } }" }
  ) {
 ...
}
```

## Working with JWT session and @auth directive

Dgraph only works with HS256 or RS256 algorithms. If you want to use session jwt to securely interact with your dgraph
database you must customize next-auth `encode` and `decode` functions,, as the default algorithm is HS512. You can
further customize the jwt with roles if you want to implement [`RBAC
logic`](https://dgraph.io/docs/graphql/authorization/directive/#role-based-access-control).

```js
import * as jwt from "jsonwebtoken";
export default NextAuth({
  session: {
    jwt: true
  },
  jwt: {
    secret: process.env.SECRET,
    encode: async ({ secret, token }) => {
      return jwt.sign({...token, userId: token.id}, secret, {
        algorithm: "HS256",
        expiresIn: 30 * 24 * 60 * 60; // 30 days
      });;
    },
    decode: async ({ secret, token }) => {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    }
  },
})
```

Once your `Dgraph.Authorization` is defined in your schema and the JWT settings are set, this will allow you to define
[`@auth rules`](https://dgraph.io/docs/graphql/authorization/authorization-overview/) for every part of your schema.
