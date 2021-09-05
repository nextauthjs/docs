---
id: instagram
title: Instagram
---

## Documentation

https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

## Configuration

https://developers.facebook.com/apps/

## Options

The **Instagram Provider** comes with a set of default options:

- [Instagram Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/instagram.js)

You can override any of the options to suit your own use case.

## Example

```jsx
// pages/api/auth/[...nextauth].js
import InstagramProvider from `next-auth/providers/instagram`
...
providers: [
  InstagramProvider({
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
  })
]
...
// pages/index.jsx
import { signIn } from "next-auth/react"
...
<button onClick={() => signIn("instagram")}>
  Sign in
</button>
...
```

:::warning
Email address is not returned by the Instagram API.
:::

:::tip
Instagram display app required callback URL to be configured in your Facebook app and Facebook required you to use **https** even for localhost! In order to do that, you either need to [add an SSL to your localhost](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) or use a proxy such as [ngrok](https://ngrok.com/docs).
:::
