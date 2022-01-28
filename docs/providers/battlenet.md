---
id: battle.net
title: Battle.net
---

## Documentation

https://develop.battle.net/documentation/guides/using-oauth

## Configuration

https://develop.battle.net/access/clients

## Options

The **Battle.net Provider** comes with a set of default options:

- [Battle.net Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/battlenet.ts)

You can override any of the options to suit your own use case.

## Example

### Minimal configuration
```js
import BattleNetProvider from "next-auth/providers/battlenet";
...
providers: [
  BattleNetProvider({
    clientId: process.env.BATTLENET_CLIENT_ID,
    clientSecret: process.env.BATTLENET_CLIENT_SECRET,
    region: process.env.BATTLENET_REGION
  })
]
...
```

### Request access to WoW profile
```js
import BattleNetProvider from "next-auth/providers/battlenet";
...
providers: [
  BattleNetProvider({
    clientId: process.env.BATTLENET_CLIENT_ID,
    clientSecret: process.env.BATTLENET_CLIENT_SECRET,
    region: process.env.BATTLENET_REGION,
    authorization: {
      params: {
        scope: 'openid wow.profile'
      }
    }
  })
]
...
```
:::note
`openid` should be always included in the scope list
:::


### NextAuth configuration to save the access token to the user session
:::tip
The `accessToken` can be used to fetch profile data from a specific Game
:::
```js
...
export default NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      region: process.env.BATTLENET_REGION,
      authorization: {
        params: {
          scope: 'openid wow.profile'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 // 1 day
  },
  callbacks: {
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
})
```