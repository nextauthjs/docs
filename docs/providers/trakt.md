---
id: trakt
title: Trakt
---

## Documentation

https://trakt.docs.apiary.io

## Configuration

If you're using the api in production by calling [api.trakt.tv](https://api.trakt.tv). Follow the production example. If you wish to develop on Trakt's sandbox environment by calling [api-staging.trakt.tv](https://api-staging.trakt.tv). Follow the development example.

Start by creating an OAuth app on Trakt for [production](https://trakt.tv/oauth/applications/new) or [development](https://staging.trakt.tv/oauth/applications/new). Then set the Client ID and Client Secret as `TRAKT_ID` and `TRAKT_SECRET` in `.env`.

## Options

The **Trakt Provider** comes with a set of default options:

- [Trakt Provider options](/path/to/options/file)

You can override any of the options to suit your own use case.

## Example

### Production

~~~js
providers: [
  TraktProvider({
    clientId: process.env.TRAKT_ID,
    clientSecret: process.env.TRAKT_SECRET,
  }),
]
~~~

### Development

~~~js
providers: [
  TraktProvider({
    clientId: process.env.TRAKT_ID,
    clientSecret: process.env.TRAKT_SECRET,
    authorization: {
      url: "https://api-staging.trakt.tv/oauth/authorize",
    },
    token: "https://api-staging.trakt.tv/oauth/token",
    userinfo: {
      async request(context) {
        const headers = new Headers()
        headers.set("Content-Type", "application/json")
        headers.set("Authorization", `Bearer ${context.tokens.access_token}`)
        headers.set("trakt-api-version", "2")
        headers.set("trakt-api-key", context.provider.clientId)

        const res = await fetch(
          "https://api-staging.trakt.tv/users/me?extended=full",
          { headers: headers }
        )

        const data = await res.json()
        return data
      },
    },
  }),
]
~~~

:::warning
Trakt does not allow hotlinking images. Even the authenticated user's profie picture.
:::

:::warning
Trakt does not supply the authenticated user's email.
:::
