---
id: github
title: GitHub
---

:::note
GitHub returns a field on `Account` called `refresh_token_expires_in` which is a number. See their [docs](https://docs.github.com/en/developers/apps/building-github-apps/refreshing-user-to-server-access-tokens#response). Remember to add this field to your database schema, in case if you are using an [Adapter](/adapters/overview).
:::


## Documentation

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps

## Configuration

https://github.com/settings/apps

## Options

The **GitHub Provider** comes with a set of default options:

- [GitHub Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/github.js)

You can override any of the options to suit your own use case.

## Example

```js
import GitHubProvider from `next-auth/providers/github`
...
providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })
]
...
```

## Database
If you're using a database make sure the `Account` table has, at least, the following fields.

### Prisma Adapter Example

```
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  access_token             String?
  expires_at               Int?
  refresh_token            String?
  refresh_token_expires_in Int?
  token_type               String?
  scope                    String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

:::warning
Only allows one callback URL per Client ID / Client Secret.
:::

:::tip
Email address is not returned if privacy settings are enabled.
:::
