---
id: tiktok
title: TikTok
---

## Documentation

https://developers.tiktok.com/doc/login-kit-web

## Configuration

https://developers.tiktok.com

## Options

The **TikTok** comes with a set of default options:

- [TikTok Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/tiktok.ts)

You can override any of the options to suit your own use case.

## Example

```js
import TikTok from 'next-auth/providers/tiktok'
...
providers: [
  TikTok({
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET
  })
]
...
```

## Instructions

### Testing

:::tip
TikTok requires all sites to run HTTPS (including local development instances).
:::

The following guides may be helpful:

- [How to setup localhost with HTTPS with a Next.js app](https://medium.com/@anMagpie/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68)
